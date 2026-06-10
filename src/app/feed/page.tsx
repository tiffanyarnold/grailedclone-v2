"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context";
import DesignerPickerModal from "@/components/feed/DesignerPickerModal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Calculate discount % between original and current price (mock 10-15% off for demo)
function getDiscountPct(price: number): number {
  // Simulate a "was" price 10-15% higher
  return 10;
}

function getWasPrice(price: number): number {
  return Math.round(price / 0.9);
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export default function FeedPage() {
  const { user, openLoginModal } = useAuth();
  const { listings, isFavorited, toggleFavorite } = useStore();
  const [designerPickerOpen, setDesignerPickerOpen] = useState(false);

  // Redirect to login modal if not logged in
  useEffect(() => {
    if (!user) {
      openLoginModal("login");
    }
  }, [user, openLoginModal]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-[#888] text-sm">Please log in to view your feed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show all listings as feed (in a real app, filtered by followed sellers)
  const feedListings = listings;
  const hasListings = feedListings.length > 0;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">

        {/* Page title */}
        <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-5 tracking-[-0.01em]">
          My Feed
        </h1>

        {/* Follow designers banner */}
        <div className="w-full bg-[#F5F5F5] px-5 py-4 mb-8">
          <p className="text-[13px] text-[#1A1A1A]">
            Customize your recommendations by following designers that you&apos;re into.{" "}
            <button
              onClick={() => setDesignerPickerOpen(true)}
              className="text-[#2557D6] font-bold tracking-[0.04em] hover:underline"
            >
              FOLLOW DESIGNERS →
            </button>
          </p>
        </div>

        {/* Feed grid — 5 columns like Grailed */}
        {hasListings ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
            {feedListings.map((listing) => {
              const favorited = isFavorited(user.id, listing.id);
              const wasPrice = listing.original_price ?? getWasPrice(listing.listed_price);
              const discountPct = listing.original_price
                ? Math.round((1 - listing.listed_price / listing.original_price) * 100)
                : getDiscountPct(listing.listed_price);
              const showDiscount = wasPrice > listing.listed_price;

              return (
                <div key={listing.id} className="group flex flex-col cursor-pointer">
                  {/* Image */}
                  <Link href={`/listing/${listing.id}`} className="relative block overflow-hidden aspect-square bg-[#F0F0F0]">
                    {listing.image_url[0] && (
                      <img
                        src={listing.image_url[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                      />
                    )}
                  </Link>

                  {/* Card info — matches Grailed exactly */}
                  <div className="mt-[6px] flex flex-col gap-0">
                    {/* Brand row: brand left, size right */}
                    <div className="flex items-baseline justify-between gap-1">
                      <p className="text-[11px] font-bold tracking-[0.07em] text-[#1A1A1A] uppercase truncate leading-tight">
                        {listing.brand}
                      </p>
                      <span className="text-[10px] text-[#888] font-normal flex-shrink-0 uppercase tracking-[0.05em]">
                        {listing.size}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-[12px] text-[#1A1A1A] leading-snug line-clamp-1 mt-[1px]">
                      {listing.title}
                    </p>

                    {/* Price row + heart */}
                    <div className="flex items-center justify-between mt-[3px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {showDiscount ? (
                          <>
                            <span className="text-[12px] font-bold text-[#C62828]">${listing.listed_price.toLocaleString()}</span>
                            <span className="text-[11px] text-[#888] line-through">${wasPrice.toLocaleString()}</span>
                            <span className="text-[10px] text-[#888]">{discountPct}% off</span>
                          </>
                        ) : (
                          <span className="text-[12px] font-bold text-[#1A1A1A]">${listing.listed_price.toLocaleString()}</span>
                        )}
                      </div>
                      {/* Heart button — bottom right of info row, matching Grailed */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(user.id, listing.id);
                        }}
                        className="flex-shrink-0 ml-1 p-0.5 text-[#888] hover:text-[#1A1A1A] transition-colors"
                        aria-label="Save"
                      >
                        <Heart
                          className="w-[15px] h-[15px]"
                          fill={favorited ? "#1A1A1A" : "none"}
                          stroke={favorited ? "#1A1A1A" : "#888"}
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>

                    {/* Location */}
                    <p className="text-[10px] text-[#888] mt-[2px]">Located in United States</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#888] text-sm">No listings in your feed yet.</p>
            <Link
              href="/browse"
              className="inline-block mt-4 text-[#2557D6] text-sm font-bold tracking-[0.04em] hover:underline"
            >
              BROWSE ALL LISTINGS →
            </Link>
          </div>
        )}

      </div>

      <Footer />

      <DesignerPickerModal
        open={designerPickerOpen}
        onClose={() => setDesignerPickerOpen(false)}
      />
    </div>
  );
}
