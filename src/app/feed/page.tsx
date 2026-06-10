"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context";
import DesignerPickerModal from "@/components/feed/DesignerPickerModal";

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#888] text-sm" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          Please log in to view your feed.
        </p>
      </div>
    );
  }

  // Show all listings as feed (in a real app, filtered by followed sellers)
  const feedListings = listings;
  const hasListings = feedListings.length > 0;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
      <div className="max-w-[1440px] mx-auto px-8 py-10">

        {/* Page title */}
        <h1
          className="text-[32px] font-bold text-[#1A1A1A] mb-6"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          My Feed
        </h1>

        {/* Follow designers banner */}
        <div className="w-full bg-[#F5F5F5] px-5 py-4 mb-8 flex items-center">
          <p className="text-sm text-[#1A1A1A]">
            Customize your recommendations by following designers that you&apos;re into.{" "}
            <button
              onClick={() => setDesignerPickerOpen(true)}
              className="text-[#2557D6] font-bold tracking-[0.04em] hover:underline"
            >
              FOLLOW DESIGNERS →
            </button>
          </p>
        </div>

        {/* Feed grid */}
        {hasListings ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {feedListings.map((listing) => {
              const favorited = isFavorited(user.id, listing.id);
              const wasPrice = getWasPrice(listing.listed_price);
              const discountPct = getDiscountPct(listing.listed_price);

              return (
                <div key={listing.id} className="group flex flex-col">
                  {/* Image */}
                  <Link href={`/listing/${listing.id}`} className="relative block overflow-hidden aspect-square bg-[#F5F5F5]">
                    <img
                      src={listing.image_url[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    />
                    {/* Heart button */}
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
                        fill={favorited ? "#1A1A1A" : "none"}
                        stroke="#1A1A1A"
                        strokeWidth={1.5}
                      />
                    </button>
                  </Link>

                  {/* Card info */}
                  <div className="mt-2 flex flex-col gap-[2px]">
                    {/* Time ago */}
                    <p className="text-[10px] text-[#888]">{timeAgo(listing.created_at)}</p>

                    {/* Brand */}
                    <p className="text-[11px] font-bold tracking-[0.06em] text-[#1A1A1A] uppercase truncate">
                      {listing.brand}
                    </p>

                    {/* Title */}
                    <p className="text-[12px] text-[#1A1A1A] leading-snug line-clamp-2">
                      {listing.title}
                    </p>

                    {/* Size */}
                    <p className="text-[11px] text-[#888]">{listing.size}</p>

                    {/* Price row */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[13px] font-bold text-[#C62828]">${listing.listed_price.toLocaleString()}</span>
                      <span className="text-[12px] text-[#888] line-through">${wasPrice.toLocaleString()}</span>
                      <span className="text-[11px] text-[#888]">{discountPct}% off</span>
                    </div>

                    {/* Location */}
                    <p className="text-[11px] text-[#888]">Located in United States</p>
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

      <DesignerPickerModal
        open={designerPickerOpen}
        onClose={() => setDesignerPickerOpen(false)}
      />
    </div>
  );
}
