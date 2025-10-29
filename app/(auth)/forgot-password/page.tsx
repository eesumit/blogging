"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        const sent = localStorage.getItem("forgot-email-sent");
        if (sent === "true") setEmailSent(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required.");
            return;
        }
        setEmailSent(true);
        //send the token to the given mail here we will
        await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        localStorage.setItem("forgot-email-sent", "true");
        setEmailSent(true);
    };

    const handleBackToLogin = () => {
        localStorage.removeItem("forgot-email-sent");
        router.push("/login");
    };
    return emailSent ? (
        <div className="text-center text-green-400 mt-10">
            <p className="bg-gray-500/10 border-2 border-gray-600 px-5 py-2 inline rounded-lg">If an account with <span className="underline">{email}</span> email exists, we’ve sent a password reset link.</p><br />
            <button
                onClick={handleBackToLogin}
                className="p-2 mt-5 border border-amber-400 rounded-md text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 hover:cursor-pointer"
            >
                Back to Login
            </button>
        </div>
    ) : (
        <div className="min-h-screen relative flex items-center justify-center bg-gray-950 overflow-hidden">
            {/* 🔹 Background grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:25px_25px]"></div>

            {/* 🔹 Subtle glowing corners */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-amber-400/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400/10 blur-3xl"></div>

            {/* 🔹 Register form */}
            <div className="relative z-10 border border-white/20 rounded-2xl p-10 backdrop-blur-md bg-gray-900/60 shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-all duration-300">
                <h1 className="text-2xl font-semibold text-white text-center">Forgot password?</h1>
                <p className="text-xs text-center mb-5">we&apos;ll send a link to your registered email, <br />please provide your registered email I&apos;d</p>
                <form className="flex flex-col gap-1 " onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        placeholder="Email Address"
                        className="w-72 px-4 py-2 mt-5 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && <p className="text-sm text-red-700 px-2">{error}</p>}
                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="text-sm text-gray-400 hover:text-amber-400 transition-colors flex justify-end px-1 cursor-pointer"

                    >
                        Login with Password?
                    </button>
                    <button
                        type="submit"
                        className="w-full py-2 mt-5 border border-amber-400 rounded-md text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 hover:cursor-pointer"
                    >
                        Send Link
                    </button>
                </form>
                <p className="text-sm text-gray-400 text-center mt-5">
                    Don&apos;t have an account?{" "}
                    <button onClick={() => router.push("/register")} className="text-amber-400 hover:underline cursor-pointer">Register</button>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;