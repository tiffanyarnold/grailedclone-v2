"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/auth-context";
import { X, Eye, EyeOff } from "lucide-react";

export default function LoginModal() {
  const { loginModalOpen, loginModalMode, closeLoginModal, login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(loginModalMode);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  // Sync mode when modal opens
  useEffect(() => {
    if (loginModalOpen) {
      setMode(loginModalMode);
      setShowEmailForm(false);
      setEmail("");
      setPassword("");
      setName("");
      setError("");
      setShowPassword(false);
      setSignupDone(false);
    }
  }, [loginModalOpen, loginModalMode]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (loginModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [loginModalOpen]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!loginModalOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const result = await signup(email, password, name);
      setLoading(false);
      if (result.success) {
        // Supabase sends a confirmation email before the session is established.
        // Don't close the modal — show a "check your email" screen instead so
        // the user knows they need to confirm before they're logged in.
        setSignupDone(true);
      } else {
        setError(result.error || "Sign up failed");
      }
    } else {
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        closeLoginModal();
      } else {
        setError(result.error || "Invalid email or password");
      }
    }
  };

  const switchToLogin = () => { setMode("login"); setError(""); setShowEmailForm(false); };
  const switchToSignup = () => { setMode("signup"); setError(""); setShowEmailForm(false); };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) closeLoginModal(); }}
    >
      <div
        className="relative bg-white w-full max-w-[460px] mx-4 rounded-md p-8 shadow-2xl"
        style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
      >
        {/* Close */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 text-[#888] hover:text-[#1A1A1A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── SIGNUP CONFIRMATION ── */}
        {signupDone && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <polyline points="4,12 9,17 20,7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-3">Check your email</h2>
            <p className="text-[14px] text-[#555] leading-relaxed mb-6 max-w-[320px] mx-auto">
              We sent a confirmation link to <strong className="text-[#1A1A1A]">{email}</strong>. Click the link to activate your account and log in.
            </p>
            <button
              onClick={closeLoginModal}
              className="px-8 py-3 bg-[#1A1A1A] text-white text-[12px] font-bold tracking-[0.1em] hover:bg-black transition-colors"
            >
              DONE
            </button>
            <p className="text-[12px] text-[#888] mt-4">
              Already confirmed?{" "}
              <button onClick={() => { setSignupDone(false); setMode("login"); setShowEmailForm(true); }} className="underline text-[#1A1A1A] hover:opacity-70">
                Log in
              </button>
            </p>
          </div>
        )}

        {/* ── SIGN UP MODE ── */}
        {!signupDone && mode === "signup" && !showEmailForm && (
          <>
            <h2
              className="text-[34px] text-[#1A1A1A] mb-3 leading-tight"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 800 }}
            >
              Find Your Grail
            </h2>
            <p className="text-[14px] text-[#1A1A1A] mb-8 leading-relaxed" style={{ fontWeight: 400 }}>
              Join the platform for personal style. Top designers. Trusted sellers. No hidden buyer fees.
            </p>

            {/* CREATE ACCOUNT WITH EMAIL */}
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full py-[13px] bg-[#1A1A1A] text-white text-[13px] font-bold tracking-[0.08em] hover:bg-black transition-colors mb-5"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
            >
              CREATE ACCOUNT WITH EMAIL
            </button>

            {/* Already have account */}
            <p className="text-[14px] text-[#1A1A1A] mb-8">
              Already have an account?{" "}
              <button
                onClick={switchToLogin}
                className="text-[#1A1A1A] underline hover:opacity-70"
                style={{ fontWeight: 400 }}
              >
                Log in
              </button>
            </p>

            {/* Terms */}
            <p className="text-[12px] text-[#888] leading-relaxed" style={{ textAlign: "center" }}>
              By creating an account, I accept Grailed&apos;s{" "}
              <span className="font-bold text-[#1A1A1A]">Terms of Service</span>. For Grailed&apos;s Privacy Policy, click{" "}
              <span className="font-bold text-[#1A1A1A]">here</span>.
            </p>
          </>
        )}

        {/* ── SIGN UP EMAIL FORM ── */}
        {!signupDone && mode === "signup" && showEmailForm && (
          <>
            <h2
              className="text-[34px] text-[#1A1A1A] mb-2 leading-tight"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 800 }}
            >
              Create Account
            </h2>
            <p className="text-[14px] text-[#1A1A1A] mb-7 leading-relaxed" style={{ fontWeight: 400 }}>
              Join the platform for personal style.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-3 border border-[#D4D4D4] text-sm outline-none focus:border-[#1A1A1A] rounded-sm"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 border border-[#D4D4D4] text-sm outline-none focus:border-[#1A1A1A] rounded-sm"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-11 border border-[#D4D4D4] text-sm outline-none focus:border-[#1A1A1A] rounded-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1A1A1A] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-xs text-[#DC2626]">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-[14px] bg-[#1A1A1A] text-white text-[11px] font-bold tracking-[0.14em] hover:bg-black transition-colors disabled:opacity-60 rounded-sm mt-1"
              >
                {loading ? "..." : "SIGN UP"}
              </button>
            </form>

            <p className="text-sm text-[#555] text-center mt-6">
              Already have an account?{" "}
              <button onClick={switchToLogin} className="text-[#1A1A1A] font-semibold underline hover:opacity-70">
                Log in
              </button>
            </p>

            <p className="text-[11px] text-[#888] text-center leading-relaxed mt-5">
              By creating an account, I accept Grailed&apos;s{" "}
              <span className="font-bold text-[#555]">Terms of Service</span>. For Grailed&apos;s Privacy Policy, click{" "}
              <span className="font-bold text-[#555]">here</span>.
            </p>
          </>
        )}

        {/* ── LOG IN MODE — landing screen ── */}
        {mode === "login" && !showEmailForm && (
          <>
            <h2
              className="text-[34px] text-[#1A1A1A] mb-2 leading-tight"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 800 }}
            >
              Log in
            </h2>
            <p className="text-[14px] text-[#1A1A1A] mb-8 leading-relaxed" style={{ fontWeight: 400 }}>
              Log in to your Grailed account to buy, sell, comment, and more.
            </p>

            {/* LOG IN WITH EMAIL */}
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full py-[13px] bg-[#1A1A1A] text-white text-[13px] font-bold tracking-[0.08em] hover:bg-black transition-colors mb-5"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
            >
              LOG IN WITH EMAIL
            </button>

            <p className="text-[14px] text-[#1A1A1A]">
              Don&apos;t have an account?{" "}
              <button onClick={switchToSignup} className="text-[#1A1A1A] underline hover:opacity-70" style={{ fontWeight: 400 }}>
                Sign Up
              </button>
            </p>
          </>
        )}

        {/* ── LOG IN MODE — email form ── */}
        {mode === "login" && showEmailForm && (
          <>
            <h2
              className="text-[34px] text-[#1A1A1A] mb-2 leading-tight"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 800 }}
            >
              Log in
            </h2>
            <p className="text-[14px] text-[#1A1A1A] mb-7 leading-relaxed" style={{ fontWeight: 400 }}>
              Log in to your Grailed account to buy, sell, comment, and more.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 border border-[#D4D4D4] text-sm outline-none focus:border-[#1A1A1A] rounded-sm"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-11 border border-[#D4D4D4] text-sm outline-none focus:border-[#1A1A1A] rounded-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1A1A1A] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-xs text-[#DC2626]">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-[13px] bg-[#1A1A1A] text-white text-[13px] font-bold tracking-[0.08em] hover:bg-black transition-colors disabled:opacity-60 mt-1"
                style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
              >
                {loading ? "..." : "LOG IN"}
              </button>
            </form>

            <p className="text-[14px] text-[#1A1A1A] mt-6">
              Don&apos;t have an account?{" "}
              <button onClick={switchToSignup} className="text-[#1A1A1A] underline hover:opacity-70" style={{ fontWeight: 400 }}>
                Sign Up
              </button>
            </p>

            {/* Demo accounts */}
            <div className="mt-6 pt-4 border-t border-[#E8E8E8]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2 text-center">Demo Accounts</p>
              <div className="space-y-1 text-[10px] text-gray-500 text-center">
                <p><span className="font-medium">Admin:</span> jillian.krebsbach@pursuit.org / Password123!</p>
                <p><span className="font-medium">Admin:</span> tiffanyarnold@pursuit.org / Password123!</p>
                <p><span className="font-medium">Seller:</span> marcus@seller.com / Password123!</p>
                <p><span className="font-medium">Buyer:</span> jordan@buyer.com / Password123!</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
