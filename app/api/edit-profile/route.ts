import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

try {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (err) {
  console.error("Cloudinary config error:", err);
}

export async function POST(request: NextRequest) {
  try {
    // Check session (only logged-in users can update)
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get logged-in userId
    const userId = session.user.id;

    // Connect to DB
    try {
      await connectToDatabase();
    } catch (dbErr) {
      console.error("Database connection error:", dbErr);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Get body data (fields to update)
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (formErr) {
      console.error("Failed to parse form data:", formErr);
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const name = formData.get("name") as string | null;
    const username = formData.get("username") as string | null;
    const bio = formData.get("bio") as string | null;
    const image = formData.get("file") as File | null;
    
    if (!image && !name && !username && !bio) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }
    
    let cloudinaryImageUrl: string | null = null;
    if (image) {
      let bytes: ArrayBuffer;
      try {
        bytes = await image.arrayBuffer();
      } catch (arrErr) {
        console.error("Failed to read image buffer:", arrErr);
        return NextResponse.json({ error: "Failed to read image" }, { status: 400 });
      }
      const buffer = Buffer.from(bytes);
      const folder = "user_images";

      try {
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
              if (error) return reject(error);
              if (!result) return reject(new Error("No upload result received"));
              resolve(result);
            }
          );
          stream.end(buffer);
        });
        cloudinaryImageUrl = result.secure_url;
      } catch (uploadErr: any) {
        console.error("Cloudinary upload error:", uploadErr);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }
    }

    const body: Record<string, any> = {
      ...(name && { name }),
      ...(username && { username }),
      ...(bio && { bio }),
      ...(cloudinaryImageUrl && { avatar: cloudinaryImageUrl }),
    };

    // Update user profile
    let user;
    try {
      user = await User.findByIdAndUpdate(userId, body, { new: true }).select("-password");
    } catch (updateErr) {
      console.error("User update error:", updateErr);
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Return updated user
    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error: any) {
    console.error("Unhandled error in profile update:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
