import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        //getting data from frontend
        const { name, username, email, password } = await request.json();
        //checking if data is present or not.
        if (!name || !username || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }
        //data is present, now estabilsh connection with database to find whether the provided data crossponding user already present in the db.
        await connectToDatabase();
        console.log("Database connected.");
        const existingUser = await User.findOne({ email });
        console.log("checking if user exist...");
        if (existingUser) {
            console.log(existingUser);
            return NextResponse.json(
                { error: "User already registed. Please login" },
                { status: 400 });
        }
        console.log("creating user...");
        //if user not found with related data, create new user, and return response.
        await User.create({ name, username, email, password });
        console.log("User registered successfully.");
        return NextResponse.json(
            { message: "User registered successfully." },
            { status: 201 }
        )
    } catch (error:unknown) {
        console.log("Error in registering user", error);
        return NextResponse.json(
            { error: "Failed to register userrrrrrrrrrr" },
            { status: 500 }
        );
    }
}