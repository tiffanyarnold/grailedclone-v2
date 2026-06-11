"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading, openLoginModal } = useAuth();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      openLoginModal("login");
    }
  }, [isLoading, user, openLoginModal]);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-[#888] text-sm" style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}>
            Please log in to view your profile.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    setSaved(false);
    const { error: err } = await supabase
      .from("profiles")
      .update({ name: name.trim() })
      .eq("id", user.id);
    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
    >
      <Navbar />

      <main className="max-w-[640px] mx-auto px-6 py-12">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-[#E8E8E8] border border-[#D4D4D4] flex items-center justify-center mb-3">
            <User className="w-9 h-9 text-[#888]" strokeWidth={1.5} />
          </div>
          <p className="text-[11px] text-[#888] uppercase tracking-[0.1em]">{user.role}</p>
        </div>

        <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-8 text-center tracking-tight">
          Profile Settings
        </h1>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Display name */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#888] mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-[#D4D4D4] text-[13px] outline-none focus:border-[#1A1A1A] transition-colors"
              placeholder="Your name"
              required
            />
          </div>

          {/* Email — read-only (managed by Supabase Auth) */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#888] mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-4 py-3 border border-[#E8E8E8] text-[13px] bg-[#F7F7F7] text-[#888] cursor-not-allowed"
            />
            <p className="text-[11px] text-[#AAA] mt-1">Email cannot be changed here.</p>
          </div>

          {/* Role — read-only */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#888] mb-2">
              Role
            </label>
            <input
              type="text"
              value={user.role}
              readOnly
              className="w-full px-4 py-3 border border-[#E8E8E8] text-[13px] bg-[#F7F7F7] text-[#888] cursor-not-allowed capitalize"
            />
          </div>

          {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}
          {saved && <p className="text-[12px] text-green-600">Changes saved.</p>}

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full py-[13px] bg-[#1A1A1A] text-white text-[12px] font-bold tracking-[0.12em] hover:bg-black transition-colors disabled:opacity-50"
          >
            {saving ? "SAVING…" : "SAVE CHANGES"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
