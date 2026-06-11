"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Only reference routes that actually exist in this app
const sidebarItems = {
  top: [
    { label: "MESSAGES", href: "/messages" },
    { label: "FAVORITES", href: "/favorites" },
  ],
  selling: [
    { label: "FOR SALE", href: "/seller/dashboard" },
    { label: "OFFERS", href: "/seller/dashboard?tab=offers" },
    { label: "SOLD", href: "/seller/dashboard?tab=sold" },
    { label: "DRAFTS", href: "/seller/dashboard?tab=drafts" },
  ],
  settings: [
    { label: "PROFILE", href: "/profile" },
    { label: "HELP", href: "/browse" },
  ],
};

export default function MessagesPage() {
  const { user, isLoading, openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    if (!isLoading && !user) {
      openLoginModal("login");
    }
  }, [isLoading, user, openLoginModal]);

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
          <p
            className="text-[#888] text-sm"
            style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
          >
            Please log in to view your messages.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
    >
      <Navbar />

      <div className="max-w-[1200px] mx-auto flex min-h-[calc(100vh-120px)]">

        {/* Left Sidebar — desktop only */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0 border-r border-[#E8E8E8] py-8 pr-6">
          <nav className="mb-6">
            {sidebarItems.top.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-[6px] text-[11px] font-bold tracking-[0.1em] transition-colors ${
                  item.href === "/messages"
                    ? "text-[#1A1A1A] border-b border-[#1A1A1A] w-fit mb-1"
                    : "text-[#888] hover:text-[#1A1A1A]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#888] mb-2 uppercase">
              Selling
            </p>
            <nav>
              {sidebarItems.selling.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-[6px] text-[11px] font-bold tracking-[0.1em] text-[#888] hover:text-[#1A1A1A] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#888] mb-2 uppercase">
              Settings
            </p>
            <nav>
              {sidebarItems.settings.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-[6px] text-[11px] font-bold tracking-[0.1em] text-[#888] hover:text-[#1A1A1A] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 px-6 lg:px-10">
          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-[#E8E8E8] mb-8">
            <button
              onClick={() => setActiveTab("buy")}
              className={`pb-3 text-[11px] font-bold tracking-[0.1em] transition-colors ${
                activeTab === "buy"
                  ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A] -mb-[2px]"
                  : "text-[#888] hover:text-[#1A1A1A]"
              }`}
            >
              BUY MESSAGES
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`pb-3 text-[11px] font-bold tracking-[0.1em] transition-colors ${
                activeTab === "sell"
                  ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A] -mb-[2px]"
                  : "text-[#888] hover:text-[#1A1A1A]"
              }`}
            >
              SELL MESSAGES
            </button>
          </div>

          {/* Empty state */}
          <div className="py-16 text-center">
            <p className="text-[14px] text-[#1A1A1A] mb-6 leading-relaxed max-w-[420px] mx-auto">
              {activeTab === "buy"
                ? "Your buy conversations will appear here when you make an offer, ask a question, or purchase an item."
                : "Your sell conversations will appear here when a buyer contacts you about one of your listings."}
            </p>
            <Link
              href="/browse"
              className="text-[13px] text-[#1A1A1A] underline hover:opacity-60 transition-opacity font-medium"
            >
              Browse listings →
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
