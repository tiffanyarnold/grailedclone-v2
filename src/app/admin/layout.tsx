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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      // /login just bounces back to / — skip the extra hop.
      router.push("/");
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

  const NavLinks = ({ onClose }: { onClose?: () => void }) => (
    <>
      {navItems.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[240px] bg-[#111111] text-white flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-xl font-bold tracking-tight">GRAILED</Link>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Admin Dashboard</p>
        </div>

        <nav className="flex-1 py-4">
          <NavLinks />
        </nav>

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

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#111111] text-white border-b border-white/10 flex-shrink-0">
        <div>
          <Link href="/" className="text-lg font-bold tracking-tight">GRAILED</Link>
          <span className="text-[10px] text-gray-400 ml-2 uppercase tracking-wide">Admin</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="text-white hover:opacity-70 transition-opacity"
          aria-label="Open nav"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[260px] bg-[#111111] text-white flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-lg font-bold">GRAILED Admin</span>
              <button onClick={() => setMobileNavOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 overflow-y-auto">
              <NavLinks onClose={() => setMobileNavOpen(false)} />
            </nav>
            <div className="p-4 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2">{user.name}</p>
              <button
                onClick={() => { logout(); setMobileNavOpen(false); }}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-[#F7F7F7] overflow-auto">
        {children}
      </main>
    </div>
  );
}
