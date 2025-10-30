import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try{
        const {password,token} = await request.json();
        // console.log("token is : "+token);
        if(!password || !token){
            return NextResponse.json({error:"Invalid credentials."},{status:400});
        }
        await connectToDatabase();
        const existingUser = await User.findOne({resetToken:token});
        // console.log(existingUser);
        if(!existingUser){
            // console.log("in existing user if")
            return NextResponse.json({message:"Error in resetting the password"},{status:500});
        }
        const isValidToken = token === existingUser.resetToken && existingUser.resetTokenExpiry > Date.now();
        if (!isValidToken) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }
        existingUser.resetToken = undefined;
        existingUser.resetTokenExpiry = undefined;
        existingUser.password = password;
        await existingUser.save();
        return NextResponse.json({message:"Password reset successful"},{status:200});

    } catch(error:unknown){
        console.log("Error in resetting the password.",error);
        return NextResponse.json({error:"Error in resetting the password"},{status:500});
    }
}