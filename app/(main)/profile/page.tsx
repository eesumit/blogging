import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { ObjectId } from "mongoose";
export const metadata = {
  title: "Blog | Profile",
  description: "User profile page",
};

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-bold">You need to sign in first.</h1>
      </div>
    );
  }

  // ✅ Connect directly instead of fetch
  await connectToDatabase();
  const user = await User.findById(session.user.id);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-bold">User not found.</h1>
      </div>
    );
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
  const allPosts = await Promise.all(
    profile.posts.map((postId:ObjectId) => Post.findById(postId))
  );
  
  return (
    <div className="min-w-full min-h-screen flex flex-col items-center justify-start pt-14 overflow-y-auto">
      <div className="flex gap-2">
        <div>
          <Image
            src={profile.avatar}
            alt="Profile"
            width={160}
            height={160}
            className="rounded-full object-cover h-40 w-40 border-4 border-gray-300"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-3 px-5">
          <span className="text-2xl font-bold">{profile.username}</span>
          <span className="text-sm">{profile.name}</span>
          <span className="flex gap-5">
            <span className="flex gap-1 font-bold">
              <span>{profile.posts?.length || 0}</span>
              <span>Posts</span>
            </span>
            <span className="flex gap-1 font-bold">
              <span>{profile.followers}</span>
              <span>Followers</span>
            </span>
            <span className="flex gap-1 font-bold">
              <span>{profile.following}</span>
              <span>Following</span>
            </span>
          </span>
          <span className="text-sm">{profile.bio}</span>
          <div>
            <Link href="/edit-profile">
              <Button variant={"outline"} size={"sm"} className="cursor-pointer">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold py-5">Posts</h1>
        <div className="flex flex-wrap justify-start max-w-[768px] mx-auto ">
          {allPosts?.map((post: { image: string }, i: number) => (
            <Image
              key={i}
              src={post.image}
              alt="Post"
              width={256}
              height={384}
              className="object-cover h-96 w-64 border-2 border-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
