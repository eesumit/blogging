import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
export async function GET(){
    try{
        await connectToDatabase();
        const posts = await Post.find({});
        if(posts.length === 0){
            return NextResponse.json({message : "No posts found"},{status : 404});
        }
        console.log(posts);
        return NextResponse.json(posts,{status : 200});
    } catch(err:unknown){
        console.log("Error in fetching the posts : ",err);
    }
}