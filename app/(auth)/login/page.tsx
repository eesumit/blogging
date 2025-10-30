"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // console.log(result);
    if (result?.error) {
      if (result.error === "CredentialsSignin") setError("Wrong Credentials!!");
      else setError(result.error);
    } else {
      router.push("/home");
    }
  };

  const handleGoogleLogin = async () => {
    const res = await signIn("google", { callbackUrl: "/home" });
    console.log("Google signin result:", res);
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-950 overflow-hidden px-4">
      {/* 🔹 Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:25px_25px]"></div>

      {/* 🔹 Glowing corners */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-amber-400/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400/10 blur-3xl"></div>

      {/* 🔹 Login form */}
      <div className="relative z-10 w-full max-w-md sm:max-w-sm md:max-w-md border border-white/20 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-md bg-gray-900/60 shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-all duration-300">
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
          Login to your Account
        </h1>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            placeholder="Email Address"
            className="w-full px-4 py-2 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors text-sm sm:text-base"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            className="w-full px-4 py-2 rounded-md border border-white/20 bg-transparent text-white placeholder:text-gray-400 outline-none focus:border-amber-400 transition-colors text-sm sm:text-base"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-xs sm:text-sm text-gray-400 hover:text-amber-400 transition-colors flex justify-end px-1 cursor-pointer"
          >
            Forgot Password?
          </button>

          {/* ✅ Error message */}
          {error && (
            <p className="text-red-500 text-sm font-semibold text-center mt-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-2 border border-amber-400 rounded-md text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 cursor-pointer"
          >
            Login
          </button>

          <button
            type="button"
            className="w-full py-2 mt-3 border border-amber-400 rounded-md text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            onClick={handleGoogleLogin}
          >
            Sign In with Google
          </button>
        </form>

        <p className="text-xs sm:text-sm text-gray-400 text-center mt-4">
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

export default LoginPage;
