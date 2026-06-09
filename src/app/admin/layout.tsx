"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, Package, Image, Tag, Users, Settings, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "admin") {
    return <div className="min-h-screen bg-[#F7F7F7]" />;
  }

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/listings", icon: Package, label: "Listings" },
    { href: "/admin/hero", icon: Image, label: "Hero Carousel" },
    { href: "/admin/offers", icon: Tag, label: "Offers" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const navLinks = (
    <>
      {navItems.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
              isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-[#111111] text-white px-4 py-3">
        <div>
          <Link href="/" className="text-lg font-bold tracking-tight">GRAILED</Link>
          <span className="text-[10px] text-gray-400 ml-2 uppercase tracking-wide">Admin</span>
        </div>
        <button onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle admin menu" className="p-1">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#111111] text-white border-t border-white/10">
          <nav className="py-2">{navLinks}</nav>
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2">{user.name}</p>
            <button
              onClick={() => { setMobileOpen(false); logout(); }}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[240px] bg-[#111111] text-white flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-xl font-bold tracking-tight">GRAILED</Link>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Admin Dashboard</p>
        </div>

        <nav className="flex-1 py-4">{navLinks}</nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-2">{user.name}</p>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F7F7F7] overflow-auto">
        {children}
      </main>
    </div>
  );
}
