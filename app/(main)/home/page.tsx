'use client'
import useSWR from 'swr';
import Post from "@/components/post";
import { IPost } from "@/models/Post";
// Create a fetcher function for SWR
const fetcher = (url: string) => 
  fetch(url, { credentials: "include" }).then(res => res.json());

export default function HomePage() {
  // Use SWR for data fetching with caching
  const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/getAllPosts`;
  // console.log("Home calling url is ",url);
  const { data: posts, error, isLoading } = useSWR(
    url, 
    fetcher,
    {
      revalidateOnFocus: false, // Don't refetch when window regains focus
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  );
  return (
    <div>
      <h1 className="text-center text-2xl font-bold py-3">Explore</h1>
      {isLoading ? (
        <div className="text-center py-10">Loading posts...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error loading posts</div>
      ) : posts && posts.length > 0 ? (
        posts.slice().reverse().map((post: IPost) => (
          <Post key={post._id?.toString() ?? ''} {...post} />
        ))
      ) : (
        <div className="text-center py-10">No posts found</div>
      )}
    </div>
  );
}


/*
✅ Option 1: Fetch directly from the database (Best for server components)

Since both are in the same app, you don’t need to hit your own /api/getAllPosts route from the server.
Just import your model and query it directly:

import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Please sign in first.</div>;
  }

  await connectToDatabase();
  const posts = await Post.find({});

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id}>{post.title}</div>
      ))}
    </div>
  );
}


✅ Why this works

You already have access to session via getServerSession().

No need to go through middleware or /api route.

Cleaner, faster, safer.

✅ Option 2: Fetch from the client side (if you must use API route)

If you need to hit /api/getAllPosts (e.g., for client rendering), then do the fetch on the client, not in a server component.

Example:

"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/getAllPosts", {
        credentials: "include"
      });
      const data = await res.json();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <div>
      {posts.length ? (
        posts.map((post) => <div key={post._id}>{post.title}</div>)
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}


✅ Why this works

The request is made from the browser, so cookies (NextAuth session tokens) are automatically attached.

Middleware will see the valid token and let it through.
 */