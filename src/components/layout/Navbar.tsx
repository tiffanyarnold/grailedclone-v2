"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Search, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          {user ? (
            <>
              {(user.role === "seller" || user.role === "admin") && (
                <Link
                  href={user.role === "admin" ? "/admin" : "/seller/dashboard"}
                  className="px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] border border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  {user.role === "admin" ? "ADMIN" : "SELL"}
                </Link>
              )}
              <span className="text-xs text-gray-500 px-1">{user.name}</span>
              <button
                onClick={logout}
                className="px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                LOG OUT
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] text-[#1A1A1A] hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                SELL
              </Link>
              <Link
                href="/login?mode=signup"
                className="px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] border border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                SIGN UP
              </Link>
              <Link
                href="/login"
                className="px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                LOG IN
              </Link>
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
