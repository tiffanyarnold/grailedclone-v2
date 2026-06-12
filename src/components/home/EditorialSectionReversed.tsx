"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";

const SECTION = {
  brands: "CAROL CHRISTIAN POELL, MA+, CARPE DIEM +MORE",
  title: "Leatherwork Mastery",
  categories: ["Outerwear"],
  editorial: {
    categoryLabel: "Trending Now",
    title: "Summer Tees",
    description: "Shop the hottest tees for summer, with styles from Supreme, Balenciaga, vintage graphics and more.",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1400&q=90",
  },
};

// Guaranteed fallback images for outerwear grid
const OUTERWEAR_FALLBACKS = [
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
  "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80",
];

export default function EditorialSectionReversed() {
  const { listings } = useStore();

  const colListings = listings
    .filter((l) => SECTION.categories.includes(l.category))
    .slice(0, 4);

  // Always fill to 4 with fallbacks
  const slots = Array.from({ length: 4 }, (_, i) =>
    colListings[i] ?? {
      id: `outerwear-fallback-${i}`,
      title: "Outerwear",
      image_url: [OUTERWEAR_FALLBACKS[i]],
    }
  );

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-10">
      {/* Row: tall image on left, label+title+grid on right — items-start */}
      <div className="flex flex-col-reverse lg:flex-row gap-6 items-end">

        {/* Left — tall editorial image */}
        <div className="flex-1 relative overflow-hidden" style={{ height: "clamp(300px, 50vw, 620px)" }}>
          <img
            src={SECTION.editorial.image}
            alt={SECTION.editorial.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white rounded-xl p-6 max-w-[340px] shadow-sm">
            <p
              className="text-[11px] tracking-[0.05em] text-[#888] mb-2"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
            >
              {SECTION.editorial.categoryLabel}
            </p>
            <h3
              className="text-[24px] font-bold text-[#1A1A1A] mb-2 leading-tight"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}
            >
              {SECTION.editorial.title}
            </h3>
            <p
              className="text-sm text-[#555] leading-relaxed"
              style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
            >
              {SECTION.editorial.description}
            </p>
          </div>
        </div>

        {/* Right — brand label + title above 2x2 natural-height grid */}
        <div className="w-full lg:w-[36%] flex-shrink-0">
          <p
            className="text-[10px] tracking-[0.14em] uppercase text-[#888] mb-1"
            style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
          >
            {SECTION.brands}
          </p>
          <h3
            className="text-[17px] font-bold text-[#1A1A1A] mb-3"
            style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}
          >
            {SECTION.title}
          </h3>
          <div className="grid grid-cols-2 gap-[3px]">
            {slots.map((listing, i) => (
              <Link
                key={listing.id}
                href={i === 3 ? "/browse" : `/listing/${listing.id}`}
                className="relative aspect-square overflow-hidden group bg-[#F2F2F2] flex items-center justify-center"
              >
                <img
                  src={listing.image_url[0]}
                  alt={listing.title}
                  className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-200"
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

      </div>
    </section>
  );
}
