"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";

const ROW_ONE = [
  {
    brands: "MAISON MARGIELA, ACNE STUDIOS, VETEMENTS +MORE",
    title: "Trending: Apparel",
    categories: ["Tops"],
    forceStatic: false,
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
    forceStatic: true,
    fallbacks: [
      "https://media-assets.grailed.com/prd/listing/temp/4383538a57124639ac52ee16d1cfc0f4?w=800",
      "https://media-assets.grailed.com/prd/listing/temp/afa01f860a104e83a923a2961fb1e12e?w=800",
      "https://media-assets.grailed.com/prd/listing/temp/42e1a1c77d4240dc8eddeb7d791a69f9?w=800",
      "https://media-assets.grailed.com/prd/listing/47279145/bd322463ed3d4dd4ad7e62cdc78315c3?w=800",
    ],
  },
  {
    brands: "Y-3, ADIDAS, BALENCIAGA +MORE",
    title: "Trending Athletic",
    categories: ["Footwear"],
    forceStatic: true,
    fallbacks: [
      "https://storage.googleapis.com/tempo-image-previews/user_342dbn8Ny9Wjw4RsL8HHW4GAVYL-1781283172313-image.png",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
    ],
  },
];

export default function CollectionGrid() {
  const { listings } = useStore();

  const getSlots = (cats: string[], fallbacks: string[], forceStatic?: boolean) => {
    if (forceStatic) {
      return Array.from({ length: 4 }, (_, i) => ({
        id: `fb-${i}`,
        title: "",
        image_url: [fallbacks[i]],
      }));
    }
    const found = listings.filter((l) => cats.includes(l.category)).slice(0, 4);
    return Array.from({ length: 4 }, (_, i) =>
      found[i] ?? { id: `fb-${i}`, title: "", image_url: [fallbacks[i]] }
    );
  };

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ROW_ONE.map((col) => (
          <CollectionCard key={col.title} config={col} slots={getSlots(col.categories, col.fallbacks, col.forceStatic)} />
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
  );
}
