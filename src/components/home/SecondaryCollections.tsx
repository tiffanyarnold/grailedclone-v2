"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";

const COLLECTIONS = [
  {
    brands: "CHROME HEARTS, VIVIENNE WESTWOOD +MORE",
    title: "Chromed Out",
    categories: ["Accessories"],
    forceStatic: true,
    fallbacks: [
      "https://media-assets.grailed.com/prd/listing/temp/aa15878df7314eccbdca98f758af1f9a?w=1600",
      "https://media-assets.grailed.com/prd/listing/temp/f67eea646ba4414bac71fae449902513?w=800",
      "https://media-assets.grailed.com/prd/listing/temp/6214f1ae6afc43a89fcaf87f850fdefb?w=1600",
      "https://media-assets.grailed.com/prd/listing/temp/74a5f775eaf64004a048daf50b7e2ce2?w=1600",
    ],
  },
  {
    brands: "RICK OWENS, CELINE, JAPANESE BRAND +MORE",
    title: "Dark Luxury",
    categories: ["Outerwear"],
    forceStatic: true,
    fallbacks: [
      "https://media-assets.grailed.com/prd/listing/temp/5c5b20dc0cea4897bfbeded3d054bfaf?w=1600",
      "https://media-assets.grailed.com/prd/listing/temp/611c0d40c81746f29dc5d84d30f2a8a6?w=1600",
      "https://media-assets.grailed.com/prd/listing/temp/1a02a5d316b040babdec5c82daa32c15?w=1600",
      "https://media-assets.grailed.com/prd/listing/temp/bca8b65f5c474813940f373eea94466c?w=800",
    ],
  },
  {
    brands: "ADIDAS, LEVI'S, VETEMENTS +MORE",
    title: "Court Icons",
    categories: ["Footwear"],
    fallbacks: [
      "https://storage.googleapis.com/tempo-image-previews/user_342dbn8Ny9Wjw4RsL8HHW4GAVYL-1781283172313-image.png",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    ],
  },
];

export default function SecondaryCollections() {
  const { listings } = useStore();

  const getSlots = (cats: string[], fallbacks: string[], forceStatic?: boolean) => {
    if (forceStatic) {
      return Array.from({ length: 4 }, (_, i) => ({
        id: `fb-sec-${i}`,
        title: "",
        image_url: [fallbacks[i]],
      }));
    }
    const found = listings.filter((l) => cats.includes(l.category)).slice(0, 4);
    return Array.from({ length: 4 }, (_, i) =>
      found[i] ?? { id: `fb-sec-${i}`, title: "", image_url: [fallbacks[i]] }
    );
  };

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {COLLECTIONS.map((col) => {
          const slots = getSlots(col.categories, col.fallbacks, (col as any).forceStatic);
          return (
            <div key={col.title}>
              <p
                className="text-[10px] tracking-[0.14em] uppercase text-[#888] mb-1"
                style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
              >
                {col.brands}
              </p>
              <h3
                className="text-[17px] font-bold text-[#1A1A1A] mb-3"
                style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}
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
          );
        })}
      </div>
    </section>
  );
}
