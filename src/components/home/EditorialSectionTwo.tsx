"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";

// Hardcoded hat images so grid is always filled
const HAT_IMAGES = [
  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
  "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&q=80",
  "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
  "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80",
];

const HAT_IDS = ["listing-21", "listing-22", "listing-23", "listing-24"];

export default function EditorialSectionTwo() {
  const { listings } = useStore();

  // Get hat listings, guaranteed 4 with fallback images
  const hatListings = HAT_IDS.map((id, i) => {
    const found = listings.find((l) => l.id === id);
    return found ?? {
      id: `hat-fallback-${i}`,
      title: "Hat",
      image_url: [HAT_IMAGES[i]],
      category: "Hats",
    };
  });

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10">
      {/*
        Layout: left column (label + title + grid) is shorter,
        right image is taller — they align at the top of the flex row
        but the image extends further down.
        We achieve this by: outer div has NO fixed height,
        left col is natural height, right image has a fixed min-height.
      */}
      <div className="flex flex-col lg:flex-row gap-6 items-end">

        {/* Left — label + title above 2x2 grid */}
        <div className="w-full lg:w-[36%] flex-shrink-0">
          <p
            className="text-[10px] tracking-[0.14em] uppercase text-[#888] mb-1"
            style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
          >
            From Grailed
          </p>
          <h3
            className="text-[17px] font-bold text-[#1A1A1A] mb-3"
            style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}
          >
            Hats Under $100
          </h3>
          {/* 2x2 grid — natural square aspect ratio */}
          <div className="grid grid-cols-2 gap-[3px]">
            {hatListings.map((listing, i) => (
              <Link
                key={listing.id}
                href={i === 3 ? "/browse" : `/listing/${listing.id}`}
                className="relative aspect-square overflow-hidden group bg-[#F2F2F2] flex items-center justify-center border border-[#E0E0E0]"
              >
                <img
                  src={listing.image_url[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                />
                {i === 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span
                      className="text-white text-[11px] font-bold tracking-[0.12em]"
                      style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
                    >
                      + VIEW MORE
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right — editorial image, height matched to adjacent grid */}
        <div className="flex-1 relative overflow-hidden" style={{ height: "clamp(260px, 38vw, 480px)" }}>
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=90"
            alt="Trending in Seoul"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white rounded-xl p-6 max-w-[340px] shadow-sm">
            <p
              className="text-[11px] tracking-[0.05em] text-[#888] mb-2"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
            >
              Street Style
            </p>
            <h3
              className="text-[24px] font-bold text-[#1A1A1A] mb-2 leading-tight"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}
            >
              Trending in Seoul
            </h3>
            <p
              className="text-sm text-[#555] leading-relaxed"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
            >
              See the best looks from Seoul and shop a curated collection of trending Korean designers.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
