import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
    console.log("Checking username...");
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const user = await User.findOne({ username });
        return NextResponse.json({ exists: !!user });
    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}