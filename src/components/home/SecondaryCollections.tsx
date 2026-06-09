"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";

const COLLECTIONS = [
  {
    brands: "CHROME HEARTS, VIVIENNE WESTWOOD +MORE",
    title: "Chromed Out",
    categories: ["Accessories"],
    fallbacks: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
  },
  {
    brands: "RICK OWENS, RICK OWENS DRKSHDW, UNDERCOVER +MORE",
    title: "Dark Luxury",
    categories: ["Outerwear"],
    fallbacks: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80",
    ],
  },
  {
    brands: "JORDAN BRAND, NIKE, TRAVIS SCOTT +MORE",
    title: "Court Icons",
    categories: ["Footwear"],
    fallbacks: [
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    ],
  },
];

export default function SecondaryCollections() {
  const { listings } = useStore();

  const getSlots = (cats: string[], fallbacks: string[]) => {
    const found = listings.filter((l) => cats.includes(l.category)).slice(0, 4);
    return Array.from({ length: 4 }, (_, i) =>
      found[i] ?? { id: `fb-sec-${i}`, title: "", images: [fallbacks[i]] }
    );
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {COLLECTIONS.map((col) => {
          const slots = getSlots(col.categories, col.fallbacks);
          return (
            <div key={col.title}>
              <p
                className="text-[10px] tracking-[0.14em] uppercase text-[#888] mb-1"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {col.brands}
              </p>
              <h3
                className="text-[17px] font-bold text-[#1A1A1A] mb-3"
                style={{ fontFamily: "var(--font-syne), 'Arial Black', sans-serif", fontWeight: 700 }}
              >
                {col.title}
              </h3>
              <div className="grid grid-cols-2 gap-[3px]">
                {slots.map((listing, i) => (
                  <Link
                    key={`${listing.id}-${i}`}
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
          );
        })}
      </div>
    </section>
  );
}
