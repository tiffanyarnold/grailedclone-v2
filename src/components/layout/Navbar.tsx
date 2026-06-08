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
      <div className="flex items-center justify-between px-6 py-3 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#1A1A1A]" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            GRAILED
          </h1>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[600px] mx-8">
          <div className="flex border border-[#1A1A1A]">
            <div className="flex items-center pl-3">
              <Search className="w-4 h-4 text-[#1A1A1A]" />
            </div>
            <input
              type="text"
              placeholder="Search for anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm outline-none bg-transparent placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold tracking-wide text-[#1A1A1A] border-l border-[#1A1A1A] hover:bg-gray-50 transition-colors"
            >
              SEARCH
            </button>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {(user.role === "seller" || user.role === "admin") && (
                <Link
                  href={user.role === "admin" ? "/admin" : "/seller/dashboard"}
                  className="px-4 py-2 text-xs font-bold tracking-wide border border-[#1A1A1A] hover:bg-gray-50 transition-colors"
                >
                  {user.role === "admin" ? "ADMIN" : "SELL"}
                </Link>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 text-xs font-bold tracking-wide border border-[#1A1A1A] hover:bg-gray-50 transition-colors"
              >
                LOG OUT
              </button>
              <span className="text-xs text-gray-500">{user.name}</span>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold tracking-wide border border-[#1A1A1A] hover:bg-gray-50 transition-colors"
              >
                SELL
              </Link>
              <Link
                href="/login?mode=signup"
                className="px-4 py-2 text-xs font-bold tracking-wide border border-[#1A1A1A] hover:bg-gray-50 transition-colors"
              >
                SIGN UP
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold tracking-wide bg-[#1A1A1A] text-white hover:bg-black transition-colors"
              >
                LOG IN
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Secondary Nav */}
      <nav className="border-t border-[#E8E8E8]">
        <div className="flex items-center justify-center gap-8 px-6 py-2.5 max-w-[1440px] mx-auto">
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
      className="flex items-center gap-0.5 text-[11px] font-semibold tracking-[0.08em] text-[#1A1A1A] hover:opacity-70 transition-opacity"
    >
      {children}
      {hasChevron && <ChevronDown className="w-3 h-3" />}
    </Link>
  );
}
