"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";

const MENS_FALLBACKS = [
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
];

const WOMENS_FALLBACKS = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
];

export default function ShopByCategory() {
  const { listings } = useStore();

  const allItems = listings.filter((l) =>
    ["Tops", "Outerwear", "Bottoms", "Accessories", "Footwear"].includes(l.category)
  );

  const mensSlots = Array.from({ length: 6 }, (_, i) =>
    allItems[i] ?? { id: `mens-fb-${i}`, title: "Menswear", image_url: [MENS_FALLBACKS[i]] }
  );

  const womensSlots = Array.from({ length: 6 }, (_, i) =>
    allItems[i + 6] ?? { id: `womens-fb-${i}`, title: "Womenswear", image_url: [WOMENS_FALLBACKS[i]] }
  );

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-10 space-y-10">

      {/* Shop Menswear */}
      <div>
        <h2
          className="text-[22px] font-bold text-[#1A1A1A] mb-5"
          style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: 700 }}
        >
          Shop Menswear
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {mensSlots.map((item) => (
            <Link key={item.id} href={`/listing/${item.id}`} className="group">
              <div className="aspect-square bg-[#EBEBEB] flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={item.image_url[0]}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-[1.04] transition-transform duration-200"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Shop Womenswear */}
      <div>
        <h2
          className="text-[22px] font-bold text-[#1A1A1A] mb-5"
          style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: 700 }}
        >
          Shop Womenswear
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {womensSlots.map((item) => (
            <Link key={item.id} href={`/listing/${item.id}`} className="group">
              <div className="aspect-square bg-[#EBEBEB] flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={item.image_url[0]}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-[1.04] transition-transform duration-200"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
