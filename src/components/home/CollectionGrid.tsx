"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";

const ROW_ONE = [
  {
    brands: "MAISON MARGIELA, ACNE STUDIOS, VETEMENTS +MORE",
    title: "Trending: Apparel",
    categories: ["Tops"],
    fallbacks: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    ],
  },
  {
    brands: "From Grailed",
    title: "Get In Your Bag",
    categories: ["Accessories"],
    fallbacks: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9519f94f8b81?w=800&q=80",
    ],
  },
  {
    brands: "PRADA, LEVI'S, JAPANESE BRAND +MORE",
    title: "Trending: Footwear",
    categories: ["Footwear"],
    fallbacks: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
    ],
  },
];

export default function CollectionGrid() {
  const { listings } = useStore();

  const getSlots = (cats: string[], fallbacks: string[]) => {
    const found = listings.filter((l) => cats.includes(l.category)).slice(0, 4);
    return Array.from({ length: 4 }, (_, i) =>
      found[i] ?? { id: `fb-${i}`, title: "", image_url: [fallbacks[i]] }
    );
  };

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ROW_ONE.map((col) => (
          <CollectionCard key={col.title} config={col} slots={getSlots(col.categories, col.fallbacks)} />
        ))}
      </div>
    </section>
  );
}

function CollectionCard({ config, slots }: { config: { brands: string; title: string }; slots: any[] }) {
  return (
    <div>
      <p
        className="text-[10px] tracking-[0.14em] uppercase text-[#888] mb-1"
        style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
      >
        {config.brands}
      </p>
      <h3
        className="text-[17px] font-bold text-[#1A1A1A] mb-3"
        style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}
      >
        {config.title}
      </h3>
      <div className="grid grid-cols-2 gap-[3px]">
        {slots.map((listing, i) => (
          <Link
            key={`${listing.id}-${i}`}
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
  );
}
