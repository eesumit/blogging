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
  title: "Social App | Profile",
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
    profile.posts.map((postId: ObjectId) => Post.findById(postId))
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-14 px-4 sm:px-6 md:px-10 lg:px-20">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 w-full max-w-4xl border-b border-border pb-6">
        <div className="flex-shrink-0">
          <Image
            src={profile.avatar}
            alt="Profile"
            width={160}
            height={160}
            className="rounded-full object-cover h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 border-4 border-gray-300"
          />
        </div>

        <div className="flex flex-col items-center sm:items-start justify-center gap-3 text-center sm:text-left">
          <span className="text-2xl font-bold">{profile.username}</span>
          <span className="text-sm text-muted-foreground">{profile.name}</span>

          <div className="flex gap-6 text-sm font-semibold">
            <span className="flex gap-1">
              <span>{profile.posts?.length || 0}</span>
              <span>Posts</span>
            </span>
            <span className="flex gap-1">
              <span>{profile.followers}</span>
              <span>Followers</span>
            </span>
            <span className="flex gap-1">
              <span>{profile.following}</span>
              <span>Following</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground max-w-xs sm:max-w-md">
            {profile.bio}
          </p>

          <div>
            <Link href="/edit-profile">
              <Button variant="outline" size="sm" className="mt-2">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="w-full max-w-5xl mt-8">
        <h1 className="text-2xl font-bold py-3 text-center sm:text-left">Posts</h1>
        {allPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 justify-items-center">
            {allPosts?.map((post: { image: string }, i: number) => (
              <div
                key={i}
                className="relative w-full max-w-[180px] sm:max-w-[220px] aspect-square overflow-hidden rounded-md shadow-sm"
              >
                <Image
                  src={post.image}
                  alt="Post"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-6">
            No posts yet. Create your first post!
          </p>
        )}
      </div>
    </div>
  );
}
