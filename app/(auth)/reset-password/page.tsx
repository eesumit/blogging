"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Both fields are required.");
    } else if (password !== confirmPassword) {
      setError("Confirm password does not match password.");
    } else {
      try {
        // Get the verifyToken from URL query parameters
        const searchParams = new URLSearchParams(window.location.search);
        const verifyToken = searchParams.get('token');

        if (!verifyToken) {
          // setError('Reset token is missing');
          setError('Something went wrong.');
          return;
        }

        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password, token: verifyToken }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || 'Password reset failed');
          return;
        }
      } catch (err) {
        console.log("error in resetting the password. Error :",err)
        setError('An error occurred while resetting password');
        return;
      }
      router.push("/login");
    }
  };

  const handleFocus = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-950 overflow-hidden">
      {/* 🔹 Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:25px_25px]"></div>

      {/* 🔹 Subtle glowing corners */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-amber-400/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400/10 blur-3xl"></div>

      {/* 🔹 Register form */}
      <div className="relative z-10 border border-white/20 rounded-2xl p-10 backdrop-blur-md bg-gray-900/60 shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-all duration-300">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">Reset your password</h1>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            placeholder="Enter new password"
            className="w-72 px-4 py-2 mt-5 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors"
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handleFocus}
          />
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm new password"
            className="w-72 px-4 py-2 mt-5 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors"
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={handleFocus}
          />
          {error && <p className="text-sm text-red-700 px-2">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 mt-5 border border-amber-400 rounded-md text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 hover:cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;