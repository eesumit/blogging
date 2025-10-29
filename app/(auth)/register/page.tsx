"use client";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { handleUsernameCheck } from "@/lib/handleUsername";
import { useSession } from "next-auth/react";
function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session, status } = useSession();

  let debounceTimeout: NodeJS.Timeout;
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
  
    if (debounceRef.current) clearTimeout(debounceRef.current);
  
    debounceRef.current = setTimeout(() => {
      handleUsernameCheck(value, setUsername, setError);
    }, 500);
  };

  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    handleUsernameCheck(username, setUsername, setError);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (!name || !username.trim() || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError(null); // clear previous error
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name,username,email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ✅ Server error handling
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      router.push("/login");
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home');
    }
  }, [status, router]);
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-950 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Glowing Corners */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-amber-400/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400/10 blur-3xl" />

      {/* Register Form */}
      <div className="relative z-10 border border-white/20 rounded-2xl p-10 backdrop-blur-md bg-gray-900/60 shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-all duration-300">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Create an Account
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}
        onBlur={handleBlur}
        >
        
        <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-72 px-4 py-2 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="w-72 px-4 py-2 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors"
          />
            <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-72 px-4 py-2 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-72 px-4 py-2 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-72 px-4 py-2 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors"
          />

          {/* ✅ Error message */}
          {error && (
            <p className="text-red-500 text-sm font-semibold text-center -mt-3">{error}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full py-2 border border-amber-400 rounded-md text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 hover:cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-5">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-amber-400 hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
