"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";

const COLLECTION_CONFIGS = [
  { brands: "SUPREME, CHROME HEARTS, MAISON MARGIELA +MORE", title: "Trending: Apparel", categories: ["Tops"] },
  { brands: "From Grailed", title: "Get In Your Bag", categories: ["Accessories"] },
  { brands: "NIKE, MAISON MARGIELA, JORDAN BRAND +MORE", title: "Trending: Footwear", categories: ["Footwear"] },
  { brands: "CHROME HEARTS, VIVIENNE WESTWOOD +MORE", title: "Chromed Out", categories: ["Accessories"] },
  { brands: "RICK OWENS, UNDERCOVER +MORE", title: "Dark Luxury", categories: ["Outerwear"] },
  { brands: "JORDAN BRAND, NIKE, TRAVIS SCOTT +MORE", title: "Court Icons", categories: ["Footwear"] },
];

export default function CollectionGrid() {
  const { listings } = useStore();

  const getListings = (cats: string[], offset = 0) =>
    listings.filter((l) => cats.includes(l.category)).slice(offset, offset + 4);

  return (
    <section className="max-w-[1440px] mx-auto px-6 py-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COLLECTION_CONFIGS.slice(0, 3).map((col, i) => (
          <CollectionCard key={col.title} config={col} items={getListings(col.categories, i * 0)} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COLLECTION_CONFIGS.slice(3, 6).map((col, i) => (
          <CollectionCard key={col.title} config={col} items={getListings(col.categories, i * 2)} />
        ))}
      </div>
    </section>
  );
}

function CollectionCard({ config, items }: { config: { brands: string; title: string }; items: any[] }) {
  const slots = [...items.slice(0, 4), null, null, null, null].slice(0, 4);
  return (
    <div>
      <p className="text-[10px] tracking-[0.12em] uppercase text-gray-500 mb-1">{config.brands}</p>
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">{config.title}</h3>
      <div className="grid grid-cols-2 gap-1">
        {slots.map((listing, i) =>
          !listing ? (
            <div key={i} className="aspect-square bg-[#E8E8E8]" />
          ) : (
            <Link
              key={`${listing.id}-${i}`}
              href={i === 3 ? "/browse" : `/listing/${listing.id}`}
              className="relative aspect-square overflow-hidden"
            >
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
              {i === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs font-bold tracking-[0.1em]">+ VIEW MORE</span>
                </div>
              )}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
