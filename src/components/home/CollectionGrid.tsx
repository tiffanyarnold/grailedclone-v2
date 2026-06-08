"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { collections } from "@/lib/data";

export default function CollectionGrid() {
  const { listings } = useStore();

  return (
    <section className="max-w-[1440px] mx-auto px-6 py-12">
      {/* 3-column collection grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.slice(0, 3).map((col) => (
          <CollectionCard key={col.id} collection={col} listings={listings} />
        ))}
      </div>
    </section>
  );
}

function CollectionCard({ collection, listings: allListings }: { collection: typeof collections[0]; listings: any[] }) {
  const collectionListings = collection.listings
    .map((id) => allListings.find((l) => l.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div>
      <p className="text-[10px] tracking-[0.12em] uppercase text-gray-500 mb-1">
        {collection.brands}
      </p>
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">{collection.title}</h3>
      <div className="grid grid-cols-2 gap-1">
        {collectionListings.map((listing, i) => (
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
        ))}
      </div>
    </div>
  );
}
