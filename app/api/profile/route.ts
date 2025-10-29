
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    // Get session directly from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await connectToDatabase();

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = {
      _id: user._id,
      username: user.username || user.email.split("@")[0],
      name: user.name || "Unnamed User",
      email: user.email,
      avatar: user.avatar || "/default-avatar.png",
      bio: user.bio || "No bio yet.",
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
      posts: user.posts || [],
    };

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
