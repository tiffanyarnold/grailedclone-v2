"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const sidebarItems = {
  top: [
    { label: "MESSAGES", href: "/messages", active: true },
    { label: "ORDERS", href: "/orders" },
  ],
  selling: [
    { label: "FOR SALE", href: "/seller/dashboard" },
    { label: "OFFERS", href: "/seller/dashboard?tab=offers" },
    { label: "SOLD", href: "/seller/dashboard?tab=sold" },
    { label: "DRAFTS", href: "/seller/dashboard?tab=drafts" },
  ],
  settings: [
    { label: "PROFILE", href: "/profile" },
    { label: "FEEDBACK", href: "/feedback" },
    { label: "ACCOUNT HEALTH", href: "/account-health" },
    { label: "VACATION MODE", href: "/vacation-mode" },
    { label: "SHIPPING LABELS", href: "/shipping-labels" },
    { label: "MY SIZES", href: "/my-sizes" },
    { label: "ADDRESSES", href: "/addresses" },
    { label: "PAYMENTS", href: "/payments" },
    { label: "NOTIFICATIONS", href: "/notifications" },
    { label: "DEVICES", href: "/devices" },
    { label: "HELP", href: "/help" },
  ],
};

export default function MessagesPage() {
  const { user, openLoginModal } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    if (!user) {
      openLoginModal("login");
    }
  }, [user, openLoginModal]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p
          className="text-[#888] text-sm"
          style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
        >
          Please log in to view your messages.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto flex">
        {/* Left Sidebar */}
        <aside className="w-[200px] flex-shrink-0 border-r border-[#E8E8E8] min-h-[calc(100vh-120px)] py-8 pr-6">
          {/* Top links */}
          <nav className="mb-6">
            {sidebarItems.top.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`block py-[6px] text-[11px] font-bold tracking-[0.1em] transition-colors ${
                  item.active
                    ? "text-[#1A1A1A] border-b border-[#1A1A1A] w-fit mb-1"
                    : "text-[#888] hover:text-[#1A1A1A]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* SELLING section */}
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#888] mb-2 uppercase">
              Selling
            </p>
            <nav>
              {sidebarItems.selling.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-[6px] text-[11px] font-bold tracking-[0.1em] text-[#888] hover:text-[#1A1A1A] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* SETTINGS section */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#888] mb-2 uppercase">
              Settings
            </p>
            <nav>
              {sidebarItems.settings.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-[6px] text-[11px] font-bold tracking-[0.1em] text-[#888] hover:text-[#1A1A1A] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 px-10">
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
            <p
              className="text-[14px] text-[#1A1A1A] mb-6 leading-relaxed max-w-[420px] mx-auto"
            >
              Your conversations will appear here when you make an offer, ask a
              question, or purchase an item.
            </p>
            <a
              href="#"
              className="text-[13px] text-[#1A1A1A] underline hover:opacity-60 transition-opacity font-medium"
            >
              Click Here to View Archived Messages
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
