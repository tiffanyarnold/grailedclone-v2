"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { editorialSections } from "@/lib/data";

const SECTION_CONFIG = {
  brands: "CHROME HEARTS, LOUIS VUITTON, SUPREME +MORE",
  title: "Trending: Accessories",
  categories: ["Accessories"],
};

// Guaranteed fallback images for accessories grid
const ACCESSORY_FALLBACKS = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
  "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
];

export default function EditorialSection() {
  const { listings } = useStore();
  const section = editorialSections[0];

  const colListings = listings
    .filter((l) => SECTION_CONFIG.categories.includes(l.category))
    .slice(0, 4);

  // Always fill to 4 with fallback image objects
  const slots = Array.from({ length: 4 }, (_, i) =>
    colListings[i] ?? {
      id: `acc-fallback-${i}`,
      title: "Accessories",
      images: [ACCESSORY_FALLBACKS[i]],
    }
  );

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-6 items-end">

        {/* Left — labels + title directly above 2x2 grid */}
        <div className="w-full lg:w-[36%] flex-shrink-0 flex flex-col">
          <p
            className="text-[10px] tracking-[0.14em] uppercase text-[#888] mb-1"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            {SECTION_CONFIG.brands}
          </p>
          <h3
            className="text-[17px] font-bold text-[#1A1A1A] mb-3"
            style={{ fontFamily: "var(--font-syne), 'Arial Black', sans-serif", fontWeight: 700 }}
          >
            {SECTION_CONFIG.title}
          </h3>

          {/* 2x2 equal grid */}
          <div className="grid grid-cols-2 gap-[3px]">
            {slots.map((listing, i) => (
              <Link
                key={listing.id}
                href={i === 3 ? "/browse" : `/listing/${listing.id}`}
                className="relative aspect-square overflow-hidden group"
              >
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                />
                {i === 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span
                      className="text-white text-[11px] font-bold tracking-[0.12em]"
                      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                      + VIEW MORE
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right — tall editorial image */}
        <div className="flex-1 relative overflow-hidden" style={{ height: "clamp(300px, 50vw, 620px)" }}>
          <img
            src={section.image}
            alt={section.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white rounded-xl p-6 max-w-[340px] shadow-sm">
            <p
              className="text-[11px] tracking-[0.05em] text-[#888] mb-2"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              {section.categoryLabel}
            </p>
            <h3
              className="text-[24px] font-bold text-[#1A1A1A] mb-2 leading-tight"
              style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700 }}
            >
              {section.title}
            </h3>
            <p
              className="text-sm text-[#555] leading-relaxed"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              {section.description}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
