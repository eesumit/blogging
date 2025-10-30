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

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      localStorage.setItem("forgot-email-sent", "true");
      setEmailSent(true);
    } catch (err: unknown) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Try again later.");
    }
  };

  const handleBackToLogin = () => {
    localStorage.removeItem("forgot-email-sent");
    router.push("/login");
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-center px-4">
        <div className="max-w-md border border-white/20 bg-gray-900/60 rounded-2xl p-6 sm:p-10 backdrop-blur-md shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-all duration-300">
          <p className="text-green-400 mb-4 text-sm sm:text-base">
            If an account with <span className="underline">{email}</span> exists, we’ve sent a password reset link.
          </p>
          <button
            onClick={handleBackToLogin}
            className="py-2 px-4 border border-amber-400 rounded-md text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-950 overflow-hidden px-4 sm:px-6">
      {/* 🔹 Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* 🔹 Subtle glowing corners */}
      <div className="absolute top-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-amber-400/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-purple-400/10 blur-3xl" />

      {/* 🔹 Forgot Password Form */}
      <div className="relative z-10 border border-white/20 rounded-2xl p-6 sm:p-10 backdrop-blur-md bg-gray-900/60 w-full max-w-sm sm:max-w-md shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-all duration-300">
        <h1 className="text-xl sm:text-2xl font-semibold text-white text-center mb-2">
          Forgot password?
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 text-center mb-6">
          We’ll send a link to your registered email.<br />Please enter your registered email ID.
        </p>

        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            placeholder="Email Address"
            className="w-full px-4 py-2 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors"
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <p className="text-red-500 text-sm font-semibold text-center -mt-2">{error}</p>
          )}

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-xs sm:text-sm text-gray-400 hover:text-amber-400 transition-colors flex justify-end px-1 cursor-pointer"
          >
            Login with Password?
          </button>

          <button
            type="submit"
            className="w-full py-2 mt-2 border border-amber-400 rounded-md text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 cursor-pointer"
          >
            Send Link
          </button>
        </form>

        <p className="text-xs sm:text-sm text-gray-400 text-center mt-5">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-amber-400 hover:underline cursor-pointer"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
