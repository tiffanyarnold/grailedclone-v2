"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F7F7]" />}>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = searchParams.get("mode") === "signup";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);
    if (result.success) {
      // Redirect based on role
      const stored = localStorage.getItem("grailed_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "seller") {
          router.push("/seller/dashboard");
        } else {
          router.push("/");
        }
      }
    } else {
      setError(result.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-[#1A1A1A]">GRAILED</h1>
      </Link>

      <div className="w-full max-w-[400px] bg-white border border-[#D4D4D4] p-8">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-6 text-center">
          {isSignup ? "Sign Up" : "Log In"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm outline-none focus:border-[#1A1A1A]"
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 text-sm outline-none focus:border-[#1A1A1A]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 text-sm outline-none focus:border-[#1A1A1A]"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-[#DC2626]">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black transition-colors"
          >
            {isSignup ? "SIGN UP" : "LOG IN"}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isSignup ? (
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#1A1A1A] font-medium hover:underline">
                Log In
              </Link>
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/login?mode=signup" className="text-[#1A1A1A] font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          )}
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 pt-4 border-t border-[#E8E8E8]">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2 text-center">Demo Accounts</p>
          <div className="space-y-1 text-[10px] text-gray-500">
            <p><span className="font-medium">Admin:</span> jillian.krebsbach@pursuit.org / Password123!</p>
            <p><span className="font-medium">Seller:</span> marcus@seller.com / Password123!</p>
            <p><span className="font-medium">Buyer:</span> jordan@buyer.com / Password123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
