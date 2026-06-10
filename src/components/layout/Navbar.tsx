"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Search, ChevronDown, MessageCircle, Heart, User } from "lucide-react";
import DesignerPickerModal, { getFollowedDesigners } from "@/components/feed/DesignerPickerModal";

export default function Navbar() {
  const { user, logout, openLoginModal } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [designerPickerOpen, setDesignerPickerOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const followed = getFollowedDesigners();
    if (followed.length === 0) {
      setDesignerPickerOpen(true);
    } else {
      router.push("/feed");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#D4D4D4]">
      {/* Top Nav */}
      <div className="relative flex items-center px-8 py-3 max-w-[1440px] mx-auto h-[64px]">

        {/* Logo — far left */}
        <Link href="/" className="flex-shrink-0">
          <h1
            className="text-[26px] leading-none text-[#1A1A1A]"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 800,
              letterSpacing: "0.04em",
            }}
          >
            GRAILED
          </h1>
        </Link>

        {/* Search — absolutely centered on the full navbar width */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[460px]">
          <form onSubmit={handleSearch}>
            <div className="flex items-center border border-[#1A1A1A] overflow-hidden h-[40px]">
              <div className="flex items-center pl-3 flex-shrink-0">
                <Search className="w-4 h-4 text-[#888]" />
              </div>
              <input
                type="text"
                placeholder="Search for anything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 text-sm outline-none bg-transparent placeholder:text-[#999] h-full"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              />
              <button
                type="submit"
                className="h-full px-5 text-[11px] font-bold tracking-[0.12em] text-[#1A1A1A] border-l border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors whitespace-nowrap flex-shrink-0"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                SEARCH
              </button>
            </div>
          </form>
        </div>

        {/* Right Actions — far right */}
        <div className="ml-auto flex items-center gap-4 flex-shrink-0">
          {user ? (
            <>
              {/* SELL / ADMIN link */}
              <Link
                href={user.role === "admin" ? "/admin" : "/seller/dashboard"}
                className="px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] border border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {user.role === "admin" ? "ADMIN" : "SELL"}
              </Link>

              {/* MY FEED */}
              <button
                onClick={handleFeedClick}
                className="text-[11px] font-bold tracking-[0.1em] text-[#1A1A1A] hover:opacity-60 transition-opacity whitespace-nowrap"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                MY FEED
              </button>

              {/* Messages icon */}
              <button
                onClick={() => router.push("/messages")}
                className="relative text-[#1A1A1A] hover:opacity-60 transition-opacity"
              >
                <MessageCircle className="w-[22px] h-[22px]" strokeWidth={1.5} />
              </button>

              {/* Favorites icon */}
              <button className="relative text-[#1A1A1A] hover:opacity-60 transition-opacity">
                <Heart className="w-[22px] h-[22px]" strokeWidth={1.5} />
              </button>

              {/* Avatar + dropdown */}
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen((o) => !o)}
                  className="w-[34px] h-[34px] rounded-full bg-[#1A1A1A] flex items-center justify-center text-white hover:opacity-80 transition-opacity overflow-hidden flex-shrink-0"
                >
                  <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-[200px] bg-white border border-[#E8E8E8] shadow-lg rounded-sm z-50 py-1"
                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                  >
                    <div className="px-4 py-3 border-b border-[#E8E8E8]">
                      <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#888] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/seller/dashboard"
                      onClick={() => setAvatarOpen(false)}
                      className="block px-4 py-2 text-[12px] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={(e) => { setAvatarOpen(false); handleFeedClick(e as unknown as React.MouseEvent); }}
                      className="w-full text-left block px-4 py-2 text-[12px] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                    >
                      My Feed
                    </button>
                    <div className="border-t border-[#E8E8E8] mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setAvatarOpen(false); }}
                        className="w-full text-left px-4 py-2 text-[12px] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => openLoginModal("login")}
                className="px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] text-[#1A1A1A] hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                SELL
              </button>
              <button
                onClick={() => openLoginModal("signup")}
                className="px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] border border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                SIGN UP
              </button>
              <button
                onClick={() => openLoginModal("login")}
                className="px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                LOG IN
              </button>
            </>
          )}
        </div>
      </div>

      {/* Secondary Nav */}
      <nav className="border-t border-[#E8E8E8]">
        <div className="flex items-center justify-between px-8 py-3 max-w-[1440px] mx-auto">
          <NavLink href="/browse?category=designers" hasChevron>DESIGNERS</NavLink>
          <NavLink href="/browse?category=menswear" hasChevron>MENSWEAR</NavLink>
          <NavLink href="/browse?category=womenswear" hasChevron>WOMENSWEAR</NavLink>
          <NavLink href="/browse?category=footwear">SNEAKERS</NavLink>
          <NavLink href="/browse">STAFF PICKS</NavLink>
          <NavLink href="/browse">COLLECTIONS</NavLink>
          <NavLink href="/browse">EDITORIAL</NavLink>
        </div>
      </nav>

      {/* Designer Picker Modal */}
      <DesignerPickerModal
        open={designerPickerOpen}
        onClose={() => setDesignerPickerOpen(false)}
      />
    </header>
  );
}

function NavLink({ href, children, hasChevron }: { href: string; children: React.ReactNode; hasChevron?: boolean }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-0.5 text-[11px] font-semibold tracking-[0.12em] text-[#1A1A1A] hover:opacity-60 transition-opacity whitespace-nowrap"
      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
    >
      {children}
      {hasChevron && <ChevronDown className="w-3 h-3 ml-0.5" />}
    </Link>
  );
}
