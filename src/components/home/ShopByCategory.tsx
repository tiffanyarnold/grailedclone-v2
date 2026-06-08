"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";

export default function ShopByCategory() {
  const { listings } = useStore();

  const menswearItems = listings.filter((l) =>
    ["Tops", "Outerwear", "Bottoms", "Accessories", "Footwear"].includes(l.category)
  ).slice(0, 6);

  const womenswearItems = listings.filter((l) =>
    ["Tops", "Outerwear", "Accessories", "Footwear"].includes(l.category)
  ).slice(6, 12);

  return (
    <section className="max-w-[1440px] mx-auto px-6 py-12 space-y-12">
      {/* Shop Menswear */}
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Shop Menswear</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {menswearItems.map((item) => (
            <Link
              key={item.id}
              href={`/listing/${item.id}`}
              className="group"
            >
              <div className="aspect-square bg-[#E8E8E8] overflow-hidden flex items-center justify-center p-4">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Shop Womenswear */}
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Shop Womenswear</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {womenswearItems.map((item) => (
            <Link
              key={item.id}
              href={`/listing/${item.id}`}
              className="group"
            >
              <div className="aspect-square bg-[#E8E8E8] overflow-hidden flex items-center justify-center p-4">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
