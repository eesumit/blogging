import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
// interface CloudinaryUploadResult {
//     public_id: string,
//     [key: string]: any
// }


export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    // Connect to DB
    try {
        await connectToDatabase();
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const fileType = formData.get("fileType") as string;
        const title = formData.get("title") as string;
        const caption = formData.get("caption") as string;
        
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const folder = fileType === "video" ? "user_videos" : "user_images"; // 👈 smart folder choice

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder, resource_type: fileType === "video" ? "video" : "image" },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error("No upload result received"));
                    resolve(result);
                }
            );
            stream.end(buffer);
        });
        const post = await Post.create({
            user:userId,
            title:title,
            description:caption,
            image:fileType === "image"? (result as UploadApiResponse).secure_url : null,
            video:fileType === "video"? (result as UploadApiResponse).secure_url : null,
        })
        const user = await User.findByIdAndUpdate(userId, { $push: { posts: post._id } }, { new: true });
        console.log(user);
        return NextResponse.json({
            message: "Upload successful",
            url: (result as UploadApiResponse).secure_url,
        });
    } catch (error: unknown) {
        console.error("Database connection error:", error);
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

}