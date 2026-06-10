"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context";
import DesignerPickerModal from "@/components/feed/DesignerPickerModal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function FeedPage() {
  const { user } = useAuth();
  const { listings, isFavorited, toggleFavorite } = useStore();
  const [designerPickerOpen, setDesignerPickerOpen] = useState(false);

  // Redirect to home if not logged in
  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-[980px] mx-auto px-4 pt-8 pb-16">

        {/* "My Feed" title — matches screenshot: large bold, tight tracking */}
        <h1
          className="text-[28px] font-bold text-[#1A1A1A] mb-5 leading-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          My Feed
        </h1>

        {/* Follow designers banner — white bg, thin gray border, matches screenshot */}
        <div className="border border-[#E8E8E8] bg-white px-4 py-3 mb-6">
          <p className="text-[13px] text-[#1A1A1A] leading-snug">
            Customize your recommendations by following designers that you&apos;re into.{" "}
            <button
              onClick={() => setDesignerPickerOpen(true)}
              className="text-[#2557D6] font-semibold underline underline-offset-1 hover:text-[#1a45c0] transition-colors"
            >
              FOLLOW DESIGNERS →
            </button>
          </p>
        </div>

        {/* Grid — 5 columns, tight gap matching Grailed */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-[10px] gap-y-6">
            {listings.map((listing) => {
              const favorited = isFavorited(user.id, listing.id);
              const hasDiscount =
                listing.original_price != null &&
                listing.original_price > listing.listed_price;
              const discountPct = hasDiscount
                ? Math.round(
                    (1 - listing.listed_price / listing.original_price!) * 100
                  )
                : null;

              return (
                <div key={listing.id} className="group flex flex-col">

                  {/* Square image */}
                  <Link
                    href={`/listing/${listing.id}`}
                    className="block relative overflow-hidden bg-[#F2F2F2]"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    {listing.image_url[0] && (
                      <img
                        src={listing.image_url[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                    )}
                  </Link>

                  {/* Card info */}
                  <div className="pt-[5px]">

                    {/* Row 1: BRAND (bold uppercase) ··· SIZE (gray uppercase) */}
                    <div className="flex items-baseline justify-between gap-1 leading-none mb-[2px]">
                      <span
                        className="text-[11px] font-bold text-[#1A1A1A] uppercase truncate"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        {listing.brand}
                      </span>
                      <span
                        className="text-[11px] text-[#888] uppercase flex-shrink-0"
                        style={{ letterSpacing: "0.04em" }}
                      >
                        {listing.size}
                      </span>
                    </div>

                    {/* Row 2: title */}
                    <p className="text-[12px] text-[#1A1A1A] leading-snug line-clamp-1 mb-[3px]">
                      {listing.title}
                    </p>

                    {/* Row 3: price + heart */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 flex-wrap leading-none">
                        {hasDiscount ? (
                          <>
                            <span className="text-[12px] font-bold text-[#CC0000]">
                              ${listing.listed_price.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-[#888] line-through">
                              ${listing.original_price!.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-[#888]">
                              {discountPct}% off
                            </span>
                          </>
                        ) : (
                          <span className="text-[12px] font-bold text-[#1A1A1A]">
                            ${listing.listed_price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Heart — outline normally, filled when saved */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(user.id, listing.id);
                        }}
                        className="flex-shrink-0 p-[2px] text-[#888] hover:text-[#1A1A1A] transition-colors"
                        aria-label="Save"
                      >
                        <Heart
                          className="w-[14px] h-[14px]"
                          fill={favorited ? "#1A1A1A" : "none"}
                          stroke={favorited ? "#1A1A1A" : "#AAAAAA"}
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>

                    {/* Row 4: location */}
                    <p className="text-[11px] text-[#888] mt-[2px]">
                      Located in United States
                    </p>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-[14px] text-[#888]">No listings in your feed yet.</p>
            <Link
              href="/browse"
              className="inline-block mt-4 text-[13px] text-[#2557D6] font-semibold underline hover:text-[#1a45c0] transition-colors"
            >
              BROWSE ALL LISTINGS →
            </Link>
          </div>
        )}
      </main>

      <Footer />

      <DesignerPickerModal
        open={designerPickerOpen}
        onClose={() => setDesignerPickerOpen(false)}
      />
    </div>
  );
}
