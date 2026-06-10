"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Search, ChevronDown, MessageCircle, Heart, User, Menu, X } from "lucide-react";
import DesignerPickerModal, { getFollowedDesigners } from "@/components/feed/DesignerPickerModal";

export default function Navbar() {
  const { user, logout, openLoginModal } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [designerPickerOpen, setDesignerPickerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const followed = getFollowedDesigners();
    if (followed.length === 0) {
      setDesignerPickerOpen(true);
    } else {
      router.push("/feed");
    }
    setMobileOpen(false);
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

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#D4D4D4]">
      {/* Top Nav */}
      <div className="relative flex items-center px-4 lg:px-8 py-3 max-w-[1440px] mx-auto h-[56px] lg:h-[64px]">

        {/* Hamburger — mobile only, far left */}
        <button
          className="lg:hidden mr-3 flex-shrink-0 text-[#1A1A1A] hover:opacity-60 transition-opacity"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
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

        {/* Search — absolutely centered on desktop, hidden on mobile */}
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

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-3 lg:gap-4 flex-shrink-0">
          {user ? (
            <>
              {/* SELL / ADMIN — desktop only */}
              <Link
                href={user.role === "admin" ? "/admin" : "/sell"}
                className="hidden lg:inline-flex px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] border border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {user.role === "admin" ? "ADMIN" : "SELL"}
              </Link>

              {/* MY FEED — desktop only */}
              <button
                onClick={handleFeedClick}
                className="hidden lg:inline-flex text-[11px] font-bold tracking-[0.1em] text-[#1A1A1A] hover:opacity-60 transition-opacity whitespace-nowrap"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                MY FEED
              </button>

              {/* Messages icon */}
              <button
                onClick={() => { router.push("/messages"); setMobileOpen(false); }}
                className="relative text-[#1A1A1A] hover:opacity-60 transition-opacity"
              >
                <MessageCircle className="w-[22px] h-[22px]" strokeWidth={1.5} />
              </button>

              {/* Favorites icon */}
              <Link href="/favorites" className="relative text-[#1A1A1A] hover:opacity-60 transition-opacity">
                <Heart className="w-[22px] h-[22px]" strokeWidth={1.5} />
              </Link>

              {/* Avatar + dropdown */}
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen((o) => !o)}
                  className="w-[32px] h-[32px] lg:w-[34px] lg:h-[34px] rounded-full bg-[#1A1A1A] flex items-center justify-center text-white hover:opacity-80 transition-opacity overflow-hidden flex-shrink-0"
                >
                  <User className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px]" strokeWidth={1.5} />
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
              {/* Desktop auth buttons */}
              <button
                onClick={() => openLoginModal("login")}
                className="hidden lg:inline-flex px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] text-[#1A1A1A] hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                SELL
              </button>
              <button
                onClick={() => openLoginModal("signup")}
                className="hidden lg:inline-flex px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] border border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                SIGN UP
              </button>
              <button
                onClick={() => openLoginModal("login")}
                className="hidden lg:inline-flex px-5 py-[7px] text-[11px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                LOG IN
              </button>
              {/* Mobile: just LOG IN button */}
              <button
                onClick={() => openLoginModal("login")}
                className="lg:hidden px-4 py-[6px] text-[11px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                LOG IN
              </button>
            </>
          )}
        </div>
      </div>

      {/* Secondary Nav — desktop only */}
      <nav className="hidden lg:block border-t border-[#E8E8E8]">
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

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div
            className="absolute left-0 top-0 h-full w-[300px] bg-white flex flex-col overflow-y-auto"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
              <span className="text-[20px] font-bold tracking-[0.04em]" style={{ fontWeight: 800 }}>GRAILED</span>
              <button onClick={() => setMobileOpen(false)} className="text-[#1A1A1A] hover:opacity-60">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile search */}
            <div className="px-5 py-4 border-b border-[#E8E8E8]">
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
                  />
                </div>
              </form>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-5 py-4">
              <p className="text-[10px] font-bold tracking-[0.14em] text-[#888] mb-3 uppercase">Browse</p>
              {[
                { label: "DESIGNERS", href: "/browse?category=designers" },
                { label: "MENSWEAR", href: "/browse?category=menswear" },
                { label: "WOMENSWEAR", href: "/browse?category=womenswear" },
                { label: "SNEAKERS", href: "/browse?category=footwear" },
                { label: "STAFF PICKS", href: "/browse" },
                { label: "COLLECTIONS", href: "/browse" },
                { label: "EDITORIAL", href: "/browse" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-[13px] font-semibold tracking-[0.08em] text-[#1A1A1A] border-b border-[#F0F0F0] hover:opacity-60 transition-opacity"
                >
                  {item.label}
                </Link>
              ))}

              {user && (
                <div className="mt-6">
                  <p className="text-[10px] font-bold tracking-[0.14em] text-[#888] mb-3 uppercase">Account</p>
                  <button
                    onClick={handleFeedClick}
                    className="block w-full text-left py-3 text-[13px] font-semibold tracking-[0.08em] text-[#1A1A1A] border-b border-[#F0F0F0] hover:opacity-60"
                  >
                    MY FEED
                  </button>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/sell"}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-[13px] font-semibold tracking-[0.08em] text-[#1A1A1A] border-b border-[#F0F0F0] hover:opacity-60"
                  >
                    {user.role === "admin" ? "ADMIN" : "SELL"}
                  </Link>
                </div>
              )}
            </nav>

            {/* Bottom auth buttons */}
            {!user && (
              <div className="px-5 py-5 border-t border-[#E8E8E8] space-y-2">
                <button
                  onClick={() => { openLoginModal("signup"); setMobileOpen(false); }}
                  className="w-full py-3 text-[12px] font-bold tracking-[0.1em] border border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                >
                  SIGN UP
                </button>
                <button
                  onClick={() => { openLoginModal("login"); setMobileOpen(false); }}
                  className="w-full py-3 text-[12px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors"
                >
                  LOG IN
                </button>
              </div>
            )}

            {user && (
              <div className="px-5 py-5 border-t border-[#E8E8E8]">
                <p className="text-[13px] font-semibold text-[#1A1A1A] truncate mb-0.5">{user.name}</p>
                <p className="text-[11px] text-[#888] truncate mb-3">{user.email}</p>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="text-[12px] font-bold tracking-[0.08em] text-[#888] hover:text-[#1A1A1A] transition-colors"
                >
                  LOG OUT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
