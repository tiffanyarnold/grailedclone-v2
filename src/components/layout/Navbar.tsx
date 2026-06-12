"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context";
import { Search, ChevronDown, MessageCircle, Heart, User, Menu, X } from "lucide-react";

// Static mock data matching Grailed's popular searches + designer suggestions
const POPULAR_SEARCHES = [
  "Rebecca Minkoff Handbag",
  "Handmade",
  "Luxury Handbags",
  "Louis Vuitton Louis Vuitton Papillon 30 Monogram Old Model Leather Bag Brown",
];

const MOCK_DESIGNERS = [
  "Handmade",
  "handvaerk",
  "Haider Ackermann",
  "Helmut Lang",
  "Heron Preston",
  "Hermes",
  "Human Made",
];

export default function Navbar() {
  const { user, logout, openLoginModal } = useAuth();
  const { listings } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Always navigate to the feed page directly.
    // The feed page itself has the designer picker banner for first-time users.
    router.push("/feed");
    setMobileOpen(false);
  };

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
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
      setDropdownOpen(false);
      setMobileOpen(false);
      inputRef.current?.blur();
    } else {
      router.push("/browse");
      setDropdownOpen(false);
    }
  };

  // Debounced live-search: if already on /browse, update URL as user types
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setDropdownOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (pathname === "/browse") {
        if (value.trim()) {
          router.replace(`/browse?search=${encodeURIComponent(value.trim())}`);
        } else {
          router.replace("/browse");
        }
      }
    }, 250);
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    router.push(`/browse?search=${encodeURIComponent(query)}`);
    setDropdownOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchQuery("");
    setDropdownOpen(false);
    if (pathname === "/browse") router.replace("/browse");
    inputRef.current?.focus();
  };

  // Compute filtered designers from both mock list and actual listing brands
  const matchingDesigners = useCallback((): string[] => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const fromListings = Array.from(new Set(listings.map((l) => l.brand)))
      .filter((b) => b.toLowerCase().startsWith(q));
    const fromMock = MOCK_DESIGNERS.filter((d) => d.toLowerCase().startsWith(q));
    // Merge, dedupe, limit to 5
    return Array.from(new Set([...fromListings, ...fromMock])).slice(0, 5);
  }, [searchQuery, listings]);

  // Compute matching popular searches
  const matchingPopular = useCallback((): string[] => {
    if (!searchQuery.trim()) return POPULAR_SEARCHES;
    const q = searchQuery.toLowerCase();
    // Also search listing titles
    const fromListings = listings
      .filter((l) => l.title.toLowerCase().includes(q) || l.brand.toLowerCase().includes(q))
      .map((l) => l.title)
      .slice(0, 3);
    const fromMock = POPULAR_SEARCHES.filter((s) => s.toLowerCase().includes(q));
    return Array.from(new Set([...fromMock, ...fromListings])).slice(0, 6);
  }, [searchQuery, listings]);

  const designers = matchingDesigners();
  const popular = matchingPopular();
  const showDropdown = dropdownOpen;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#D4D4D4]">
      {/* Top Nav */}
      <div className="relative flex items-center px-0 h-[68px]">

        {/* Hamburger — mobile only */}
        <button
          className="lg:hidden mr-3 flex-shrink-0 text-[#1A1A1A] hover:opacity-60 transition-opacity"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 ml-auto mr-10">
          <span
            className="text-[22px] leading-none text-[#1A1A1A] select-none block"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            GRAILED
          </span>
        </Link>

        {/* Search — centered, takes remaining space between logo and right actions */}
        <div
          ref={searchRef}
          className="hidden lg:block flex-1 max-w-[600px] relative"
        >
          <form onSubmit={handleSearch}>
            <div className={`flex items-center bg-white overflow-hidden h-[46px] ${dropdownOpen ? "border border-[#1A1A1A] border-b-0" : "border border-[#1A1A1A]"}`}>
              {/* Left icon — X when typing, search icon otherwise */}
              <div className="flex items-center pl-3.5 pr-1.5 flex-shrink-0">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[#888] hover:text-[#1A1A1A] transition-colors p-0.5"
                    tabIndex={-1}
                  >
                    <X className="w-[15px] h-[15px]" />
                  </button>
                ) : (
                  <Search className="w-[15px] h-[15px] text-[#888]" />
                )}
              </div>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search for anything"
                value={searchQuery}
                onChange={(e) => {
                  handleSearchChange(e.target.value);
                }}
                onFocus={() => setDropdownOpen(true)}
                className="flex-1 px-3 text-[13px] outline-none bg-transparent placeholder:text-[#999] h-full"
                autoComplete="off"
              />
              <div className="flex items-center pr-2 flex-shrink-0">
                <button
                  type="submit"
                  className="px-3 py-1 text-[11px] font-bold tracking-[0.1em] text-[#1A1A1A] border border-[#C8C8C8] hover:bg-[#F5F5F5] transition-colors whitespace-nowrap"
                >
                  SEARCH
                </button>
              </div>
            </div>
          </form>

          {/* ── Search Dropdown ── */}
          {showDropdown && (
            <div
              className="absolute left-0 right-0 top-full bg-white border border-[#1A1A1A] border-t-0 z-[200] overflow-hidden shadow-sm"
              style={{ maxHeight: "480px", overflowY: "auto" }}
            >
              {/* Info banner — light blue tint, matches Grailed exactly */}
              <div className="px-4 py-3 bg-[#EEF2FF] border-b border-[#D4DCFF]">
                <p className="text-[12px] text-[#444] leading-snug">
                  You can now use{" "}
                  <a href="#" className="text-[#2557D6] underline">negative</a>
                  {" "}and{" "}
                  <a href="#" className="text-[#2557D6] underline">exact</a>
                  {" "}key words to refine your search
                  <br />
                  (e.g. &apos;Lemaire -Uniqlo, &quot;Trucker Hat&quot;&apos;)
                </p>
              </div>

              {/* Designers section — only shown when there's a query matching designers */}
              {designers.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1.5 text-[12px] font-bold text-[#1A1A1A] tracking-[0.02em]">
                    Designers
                  </p>
                  {designers.map((designer) => (
                    <button
                      key={designer}
                      type="button"
                      onClick={() => handleSuggestionClick(designer)}
                      className="w-full text-left px-4 py-[7px] text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
                    >
                      {designer}
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches section */}
              {popular.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1.5 text-[12px] font-bold text-[#1A1A1A] tracking-[0.02em]">
                    Popular Searches
                  </p>
                  {popular.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full text-left px-4 py-[7px] text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors truncate"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              {/* Empty state when no matches */}
              {designers.length === 0 && popular.length === 0 && searchQuery.trim() && (
                <div className="px-4 py-4">
                  <p className="text-[13px] text-[#888]">No results for &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}

              {/* Bottom padding */}
              <div className="h-2" />
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="ml-10 mr-auto flex items-center gap-3 lg:gap-6 flex-shrink-0">
          {user ? (
            <>
              {/* SELL / ADMIN */}
              <Link
                href={user.role === "admin" ? "/admin" : "/sell"}
                className="hidden lg:inline-flex items-center px-4 py-[5px] text-[11px] font-bold tracking-[0.1em] border border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
              >
                {user.role === "admin" ? "ADMIN" : "SELL"}
              </Link>

              {/* MY FEED */}
              <button
                onClick={handleFeedClick}
                className="hidden lg:inline-flex items-center text-[11px] font-bold tracking-[0.1em] text-[#1A1A1A] hover:opacity-60 transition-opacity whitespace-nowrap"
              >
                MY FEED
              </button>

              {/* Messages */}
              <button
                onClick={() => { router.push("/messages"); setMobileOpen(false); }}
                className="relative text-[#1A1A1A] hover:opacity-60 transition-opacity"
              >
                <MessageCircle className="w-[20px] h-[20px]" strokeWidth={1.5} />
              </button>

              {/* Favorites */}
              <Link href="/favorites" className="relative text-[#1A1A1A] hover:opacity-60 transition-opacity">
                <Heart className="w-[20px] h-[20px]" strokeWidth={1.5} />
              </Link>

              {/* Avatar + dropdown */}
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen((o) => !o)}
                  className="w-[30px] h-[30px] rounded-full bg-[#E8E8E8] border border-[#D4D4D4] flex items-center justify-center hover:opacity-80 transition-opacity overflow-hidden flex-shrink-0 relative"
                >
                  <User className="w-[15px] h-[15px] text-[#666]" strokeWidth={1.5} />
                  {/* Red dot */}
                  <span className="absolute -top-[2px] -right-[2px] w-[8px] h-[8px] rounded-full bg-[#E53935] border-[1.5px] border-white" />
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-[200px] bg-white border border-[#E8E8E8] shadow-lg z-50 py-1">
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
              {/* Desktop: SELL + SIGN UP + LOG IN */}
              <Link
                href="/sell"
                className="hidden lg:inline-flex items-center px-4 py-[5px] text-[11px] font-bold tracking-[0.1em] border border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
              >
                SELL
              </Link>
              <button
                onClick={() => openLoginModal("signup")}
                className="hidden lg:inline-flex items-center px-4 py-[5px] text-[11px] font-bold tracking-[0.1em] border border-[#C8C8C8] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
              >
                SIGN UP
              </button>
              <button
                onClick={() => openLoginModal("login")}
                className="hidden lg:inline-flex items-center px-4 py-[5px] text-[11px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors"
              >
                LOG IN
              </button>
              {/* Mobile: LOG IN button */}
              <button
                onClick={() => openLoginModal("login")}
                className="lg:hidden px-4 py-[5px] text-[11px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors"
              >
                LOG IN
              </button>
            </>
          )}
        </div>
      </div>

      {/* Secondary Nav — desktop only */}
      <nav className="hidden lg:block border-t border-[#E8E8E8]">
        <div className="flex items-center justify-center gap-10 px-6 h-[44px]">
          <NavLink href="/browse?category=designers" hasChevron>DESIGNERS</NavLink>
          <NavLink href="/browse?category=menswear" hasChevron>MENSWEAR</NavLink>
          <NavLink href="/browse?category=womenswear" hasChevron>WOMENSWEAR</NavLink>
          <NavLink href="/browse?category=footwear">SNEAKERS</NavLink>
          <NavLink href="/browse">STAFF PICKS</NavLink>
          <NavLink href="/browse">COLLECTIONS</NavLink>
          <NavLink href="/browse">EDITORIAL</NavLink>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[300px] bg-white flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
              <span
                className="text-[20px] leading-none text-[#1A1A1A] select-none"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 500, letterSpacing: "0.04em" }}
              >GRAILED</span>
              <button onClick={() => setMobileOpen(false)} className="text-[#1A1A1A] hover:opacity-60">
                <X className="w-6 h-6" />
              </button>
            </div>
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
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="flex-1 px-3 text-sm outline-none bg-transparent placeholder:text-[#999] h-full"
                  />
                </div>
              </form>
            </div>
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

    </header>
  );
}

function NavLink({ href, children, hasChevron, accent }: { href: string; children: React.ReactNode; hasChevron?: boolean; accent?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-0 text-[12px] font-bold tracking-[0.08em] text-[#1A1A1A] hover:text-[#2557D6] transition-colors whitespace-nowrap`}
    >
      {children}
      {hasChevron && <ChevronDown className="w-[12px] h-[12px] ml-[2px] stroke-[2.5] text-current" />}
    </Link>
  );
}
