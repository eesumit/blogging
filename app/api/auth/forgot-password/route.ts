import { connectToDatabase } from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }
        await connectToDatabase();
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return NextResponse.json({ message: "If an account exists, a link has been sent." }, { status: 200 });
        }
        const token = Math.random().toString(36).substring(2, 12);
        const expire = new Date();
        expire.setHours(expire.getHours() + 1);
        existingUser.resetToken = token;
        existingUser.resetTokenExpiry = expire;
        await existingUser.save();
        console.log("User : ", existingUser);
        //Sending email...
        const res = await sendMail({ email, token });
        console.log(res);

        return NextResponse.json({ message: "If an account exists, a link has been sent." }, { status: 200 });

    } catch (error:unknown) {
        console.log("Error in sending the link, Error: ", error);
    }
}