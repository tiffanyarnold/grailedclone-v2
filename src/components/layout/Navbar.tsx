"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Search, ChevronDown, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/browse?category=designers", label: "DESIGNERS", hasChevron: true },
  { href: "/browse?category=menswear", label: "MENSWEAR", hasChevron: true },
  { href: "/browse?category=womenswear", label: "WOMENSWEAR", hasChevron: true },
  { href: "/browse?category=footwear", label: "SNEAKERS" },
  { href: "/browse", label: "STAFF PICKS" },
  { href: "/browse", label: "COLLECTIONS" },
  { href: "/browse", label: "EDITORIAL" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMobileOpen(false);
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#D4D4D4]">
      {/* Top Nav */}
      <div className="relative flex items-center gap-3 px-4 lg:px-8 py-3 max-w-[1440px] mx-auto h-[60px] lg:h-[64px]">

        {/* Mobile hamburger — far left on mobile */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="lg:hidden flex-shrink-0 -ml-1 p-1 text-[#1A1A1A]"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <h1
            className="text-[22px] lg:text-[26px] leading-none text-[#1A1A1A]"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 800,
              letterSpacing: "0.04em",
            }}
          >
            GRAILED
          </h1>
        </Link>

        {/* Search — absolutely centered on desktop only */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-[460px]">
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

        {/* Right Actions — far right (desktop) */}
        <div className="ml-auto hidden lg:flex items-center gap-3 flex-shrink-0">
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

        {/* Mobile: quick search icon to focus the mobile search */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open search"
          className="lg:hidden ml-auto flex-shrink-0 p-1 text-[#1A1A1A]"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Secondary Nav — desktop only */}
      <nav className="hidden lg:block border-t border-[#E8E8E8]">
        <div className="flex items-center justify-between px-8 py-3 max-w-[1440px] mx-auto">
          {NAV_LINKS.map((link, i) => (
            <NavLink key={i} href={link.href} hasChevron={link.hasChevron}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E8E8E8] bg-white">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-[#E8E8E8]">
            <form onSubmit={handleSearch}>
              <div className="flex items-center border border-[#1A1A1A] overflow-hidden h-[44px]">
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
                  className="h-full px-4 text-[11px] font-bold tracking-[0.12em] text-[#1A1A1A] border-l border-[#1A1A1A] active:bg-[#F7F7F7] whitespace-nowrap flex-shrink-0"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  GO
                </button>
              </div>
            </form>
          </div>

          {/* Mobile nav links */}
          <nav className="flex flex-col py-2">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-[13px] font-semibold tracking-[0.1em] text-[#1A1A1A] active:bg-[#F7F7F7]"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {link.label}
                {link.hasChevron && <ChevronDown className="w-4 h-4 -rotate-90 text-[#888]" />}
              </Link>
            ))}
          </nav>

          {/* Mobile auth actions */}
          <div className="flex flex-col gap-2 px-4 py-4 border-t border-[#E8E8E8]">
            {user ? (
              <>
                {(user.role === "seller" || user.role === "admin") && (
                  <Link
                    href={user.role === "admin" ? "/admin" : "/seller/dashboard"}
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-5 py-3 text-[12px] font-bold tracking-[0.1em] border border-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                  >
                    {user.role === "admin" ? "ADMIN" : "SELL"}
                  </Link>
                )}
                <span className="text-xs text-gray-500 text-center">Signed in as {user.name}</span>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full px-5 py-3 text-[12px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  LOG OUT
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login?mode=signup"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-5 py-3 text-[12px] font-bold tracking-[0.1em] border border-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  SIGN UP
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-5 py-3 text-[12px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  LOG IN
                </Link>
              </>
            )}
          </div>
        </div>
      )}
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
