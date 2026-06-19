"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store-context";

// Curated daily picks — static so the same items always show regardless of
// which listings happen to be newest in the DB.
const STUB_PICKS = [
  {
    id: "stub-1",
    title: "Archive Silk Blouse",
    brand: "Maison Margiela",
    listed_price: 285,
    image_url: ["https://media-assets.grailed.com/prd/listing/temp/3f6ceff009f54f9db777a332ba755663?w=800"],
  },
  {
    id: "stub-2",
    title: "Zip Mini Skirt",
    brand: "Acne Studios",
    listed_price: 165,
    image_url: ["https://media-assets.grailed.com/prd/listing/temp/90215ad01688466294b89cb18db90445?w=800"],
  },
  {
    id: "stub-3",
    title: "Rick Owens DRKSHDW Cargo Pants",
    brand: "Rick Owens",
    listed_price: 290,
    image_url: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80"],
  },
  {
    id: "stub-4",
    title: "Supreme Box Logo Hoodie FW20",
    brand: "Supreme",
    listed_price: 265,
    image_url: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"],
  },
  {
    id: "stub-5",
    title: "Nike Air Jordan 1 Retro High OG",
    brand: "Jordan Brand",
    listed_price: 220,
    image_url: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
  },
  {
    id: "stub-6",
    title: "Helmut Lang Archive Blazer",
    brand: "Helmut Lang",
    listed_price: 195,
    image_url: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80"],
  },
  {
    id: "stub-7",
    title: "Maison Margiela Tabi Boots",
    brand: "Maison Margiela",
    listed_price: 275,
    image_url: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80"],
  },
];

export default function DailyPicks() {
  const { listings } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Always show curated picks so the same quality images appear every visit.
  const picks = STUB_PICKS;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#999",
              marginBottom: "2px",
              fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Curated For You
          </p>
          <h2
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#1A1A1A",
              fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Daily Picks
          </h2>
        </div>

        {/* Scroll arrows — desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 flex items-center justify-center border border-[#D4D4D4] text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 flex items-center justify-center border border-[#D4D4D4] text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {picks.map((item) => {
          const price = "listed_price" in item ? (item as typeof picks[0]).listed_price : 0;
          const img = item.image_url?.[0] ?? "";
          const isStub = item.id.startsWith("stub-");

          return (
            <Link
              key={item.id}
              href={isStub ? "/browse" : `/listing/${item.id}`}
              className="flex-shrink-0 w-[160px] sm:w-[180px] group"
            >
              {/* Square image */}
              <div className="w-full aspect-square overflow-hidden bg-[#F2F2F2] mb-2 flex items-center justify-center border border-[#E0E0E0]">
                <img
                  src={img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80";
                  }}
                />
              </div>

              {/* Brand */}
              <p
                className="truncate"
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                  fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
                  marginBottom: "1px",
                }}
              >
                {"brand" in item ? item.brand : ""}
              </p>

              {/* Title */}
              <p
                className="truncate"
                style={{
                  fontSize: "11px",
                  color: "#555",
                  fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
                  marginBottom: "2px",
                }}
              >
                {item.title}
              </p>

              {/* Price */}
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                  fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                ${price}
              </p>
            </Link>
          );
        })}

        {/* "See All" card at the end */}
        <Link
          href="/browse"
          className="flex-shrink-0 w-[160px] sm:w-[180px] aspect-square flex flex-col items-center justify-center border border-[#E8E8E8] hover:border-[#1A1A1A] transition-colors group"
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#1A1A1A",
              fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            SEE ALL
          </span>
          <ChevronRight className="w-4 h-4 mt-1 text-[#1A1A1A]" />
        </Link>
      </div>
    </section>
  );
}
