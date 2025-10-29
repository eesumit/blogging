import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email or passsword missing.");
                }

                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        return null;
                    }
                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        throw new Error("Wrong password.");
                    }

                    return {//if we sent any data the login was successful and if we sent null then login was unsuccessful.
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error:unknown) {
                    console.log("Error in authenticating the user: ", error);
                    throw error;
                }

            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            console.log("signing ining...");
            if (account?.provider === "google") {
                await connectToDatabase();
                let existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    // create a new user in DB
                    existingUser = await User.create({
                        name: user.name,
                        username: user.email?.split("@")[0] || "unknown_user",
                        avatar: user.image,
                        bio:"new user",
                        email: user.email,
                        password: Math.random().toString(36).slice(-8)
                    });
                    // console.log("avatar url is : "+existingUser.avatar);
                }
                user.id = existingUser._id.toString();
                // console.log(user.id);
            }
            return true; // allow sign in
        },
        async jwt({ token, user }) {
            // console.log("JWT CALLBACK TOKEN:", token);
            if (user) {
                token.id = user.id; // from Credentials OR signIn callback
            } else if (!token.id && token.email) {
                // For already logged-in Google users on refresh
                await connectToDatabase();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) token.id = dbUser._id.toString();
            }
            return token;
        },
        async session({ session, token }) {
            // console.log("SESSION CALLBACK:", { session, token });
            if (session.user) {
                session.user.id = token.id as string
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET!
};
