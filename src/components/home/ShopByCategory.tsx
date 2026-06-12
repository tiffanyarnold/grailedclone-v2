"use client";

import Link from "next/link";

// Curated static mens fashion images — always displayed (consistent catalog feel)
const MENS_IMAGES = [
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
  "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80",
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",
];

const WOMENS_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
];

export default function ShopByCategory() {
  const mensSlots = MENS_IMAGES.map((img, i) => ({
    id: `mens-${i}`,
    title: "Menswear",
    href: "/browse?category=menswear",
    image_url: [img],
  }));
  const womensSlots = WOMENS_IMAGES.map((img, i) => ({
    id: `womens-${i}`,
    title: "Womenswear",
    href: "/browse?category=womenswear",
    image_url: [img],
  }));

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10 space-y-10">

      {/* Shop Menswear */}
      <div>
        <h2
          className="text-[16px] font-bold text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}
        >
          Shop Menswear
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {mensSlots.map((item) => (
            <Link key={item.id} href={item.href} className="group">
              <div className="aspect-square bg-[#EBEBEB] flex items-center justify-center overflow-hidden border border-[#E0E0E0]">
                <img
                  src={item.image_url[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-200"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Shop Womenswear */}
      <div>
        <h2
          className="text-[16px] font-bold text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}
        >
          Shop Womenswear
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {womensSlots.map((item) => (
            <Link key={item.id} href={item.href} className="group">
              <div className="aspect-square bg-[#EBEBEB] flex items-center justify-center overflow-hidden border border-[#E0E0E0]">
                <img
                  src={item.image_url[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-200"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
