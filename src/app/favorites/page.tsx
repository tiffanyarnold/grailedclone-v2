"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Tab = "Listings" | "Searches" | "Designers" | "Sellers" | "Collections";

const TABS: Tab[] = ["Listings", "Searches", "Designers", "Sellers", "Collections"];

export default function FavoritesPage() {
  const { user, openLoginModal } = useAuth();
  const { listings, isFavorited, toggleFavorite } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("Listings");

  useEffect(() => {
    if (!user) {
      openLoginModal("login");
    }
  }, [user, openLoginModal]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-[#888] text-sm" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Please log in to view your favorites.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const favoritedListings = listings.filter((l) => isFavorited(user.id, l.id));

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-8 py-10">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1
            className="text-[32px] font-bold text-[#1A1A1A] mb-3"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            Favorites
          </h1>
          <p className="text-[#888] text-[14px]">
            You will be notified when your favorite listings drop in price or are relisted.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#D4D4D4] mb-0" />

        {/* Tabs */}
        <div className="flex border-b border-[#D4D4D4] mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-[14px] font-medium transition-colors relative ${
                activeTab === tab
                  ? "text-[#1A1A1A] font-bold"
                  : "text-[#888] hover:text-[#1A1A1A]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A1A1A]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Listings" && (
          <>
            {favoritedListings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                {favoritedListings.map((listing) => (
                  <div key={listing.id} className="group flex flex-col">
                    <Link
                      href={`/listing/${listing.id}`}
                      className="relative block overflow-hidden aspect-square bg-[#F5F5F5]"
                    >
                      <img
                        src={listing.image_url[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(user.id, listing.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                      >
                        <Heart
                          className="w-4 h-4"
                          fill="#1A1A1A"
                          stroke="#1A1A1A"
                          strokeWidth={1.5}
                        />
                      </button>
                    </Link>
                    <div className="mt-2 flex flex-col gap-[2px]">
                      <p className="text-[11px] font-bold tracking-[0.06em] text-[#1A1A1A] uppercase truncate">
                        {listing.brand}
                      </p>
                      <p className="text-[12px] text-[#1A1A1A] leading-snug line-clamp-2">
                        {listing.title}
                      </p>
                      <p className="text-[11px] text-[#888]">{listing.size}</p>
                      <p className="text-[13px] font-bold text-[#1A1A1A] mt-0.5">
                        ${listing.listed_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-6">
                {/* Large heart icon */}
                <Heart className="w-24 h-24 text-[#D4D4D4]" strokeWidth={1} />
                <div className="text-center">
                  <p className="text-[#888] text-[14px] mb-1">You haven&apos;t favorited any items yet!</p>
                  <p className="text-[#888] text-[14px]">
                    Explore Grailed and favorite items to get notified if they drop in price.
                  </p>
                </div>
                <Link
                  href="/browse"
                  className="border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold tracking-[0.12em] uppercase px-8 py-3 hover:bg-[#1A1A1A] hover:text-white transition-colors"
                >
                  Browse the Feed
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab !== "Listings" && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <Heart className="w-24 h-24 text-[#D4D4D4]" strokeWidth={1} />
            <div className="text-center">
              <p className="text-[#888] text-[14px] mb-1">
                You haven&apos;t favorited any {activeTab.toLowerCase()} yet!
              </p>
              <p className="text-[#888] text-[14px]">
                Explore Grailed and favorite {activeTab.toLowerCase()} to see them here.
              </p>
            </div>
            <Link
              href="/browse"
              className="border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold tracking-[0.12em] uppercase px-8 py-3 hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              Browse the Feed
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
