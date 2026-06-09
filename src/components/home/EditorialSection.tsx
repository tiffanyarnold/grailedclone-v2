"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { editorialSections } from "@/lib/data";

const SECTION_CATEGORIES = [
  ["Tops"],
  ["Accessories"],
  ["Outerwear"],
];

export default function EditorialSection() {
  const { listings } = useStore();

  return (
    <section className="max-w-[1440px] mx-auto px-6 py-12 space-y-16">
      {editorialSections.map((section, index) => {
        const cats = SECTION_CATEGORIES[index] ?? ["Tops"];
        const colListings = listings.filter((l) => cats.includes(l.category)).slice(0, 4);

        const isReversed = index % 2 !== 0;

        return (
          <div
            key={section.id}
            className={`grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 ${isReversed ? "md:grid-cols-[3fr_2fr]" : ""}`}
          >
            {/* Left side - 2x2 grid or editorial image */}
            {!isReversed ? (
              <>
                <div className="grid grid-cols-2 gap-1">
                  {colListings.map((listing: any, i: number) => (
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
                <div className="relative overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover min-h-[400px]"
                  />
                  <div className="absolute bottom-8 left-8 bg-white p-6 max-w-[360px] shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">{section.categoryLabel}</p>
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover min-h-[400px]"
                  />
                  <div className="absolute bottom-8 left-8 bg-white p-6 max-w-[360px] shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">{section.categoryLabel}</p>
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {colListings.map((listing: any, i: number) => (
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
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
