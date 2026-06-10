"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { Heart } from "lucide-react";

export default function BrowsePageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F7F7]" />}>
      <BrowsePage />
    </Suspense>
  );
}

function BrowsePage() {
  const searchParams = useSearchParams();
  const { listings, toggleFavorite, isFavorited } = useStore();
  const { user } = useAuth();
  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("newest");
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  const brands = useMemo(() => Array.from(new Set(listings.map((l) => l.brand))).sort(), [listings]);
  const categories = useMemo(() => Array.from(new Set(listings.map((l) => l.category))).sort(), [listings]);

  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Search
    const query = localSearch.toLowerCase();
    if (query) {
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.brand.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (brandFilter.length > 0) {
      result = result.filter((l) => brandFilter.includes(l.brand));
    }

    // Category filter
    if (categoryFilter) {
      if (categoryFilter === "menswear" || categoryFilter === "womenswear") {
        // Show all categories for menswear/womenswear
      } else if (categoryFilter === "footwear") {
        result = result.filter((l) => l.category === "Footwear");
      } else if (categoryFilter === "designers") {
        // Show all
      } else {
        result = result.filter((l) => l.category === categoryFilter);
      }
    }

    // Price range
    result = result.filter((l) => l.listed_price >= priceRange[0] && l.listed_price <= priceRange[1]);

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.listed_price - b.listed_price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.listed_price - a.listed_price);
    }

    return result;
  }, [listings, localSearch, brandFilter, categoryFilter, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={"w-[220px] flex-shrink-0 " + (showFilters ? "block" : "hidden lg:block")}>
            <h2 className="text-sm font-bold mb-4 uppercase tracking-wide">Filters</h2>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wide mb-2">Brand</h3>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brandFilter.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBrandFilter([...brandFilter, brand]);
                        } else {
                          setBrandFilter(brandFilter.filter((b) => b !== brand));
                        }
                      }}
                      className="w-3.5 h-3.5 accent-black"
                    />
                    <span className="text-xs text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wide mb-2">Category</h3>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={categoryFilter === ""}
                    onChange={() => setCategoryFilter("")}
                    className="w-3.5 h-3.5 accent-black"
                  />
                  <span className="text-xs text-gray-700">All</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryFilter === cat}
                      onChange={() => setCategoryFilter(cat)}
                      className="w-3.5 h-3.5 accent-black"
                    />
                    <span className="text-xs text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wide mb-2">Price</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0] || ""}
                  onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                  className="w-20 px-2 py-1 text-xs border border-gray-300 outline-none"
                />
                <span className="text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1] === 10000 ? "" : priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                  className="w-20 px-2 py-1 text-xs border border-gray-300 outline-none"
                />
              </div>
            </div>

            {/* Condition Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wide mb-2">Condition</h3>
              <div className="space-y-1.5">
                {["New/Never Worn", "Gently Used"].map((cond) => (
                  <label key={cond} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-black" />
                    <span className="text-xs text-gray-700">{cond}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 outline-none w-full sm:w-[240px]"
                />
                <span className="text-xs text-gray-500">{filteredListings.length} results</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 outline-none bg-white"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low–High</option>
                <option value="price-high">Price: High–Low</option>
              </select>
            </div>

            {/* Active Filters */}
            {(brandFilter.length > 0 || categoryFilter) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {brandFilter.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrandFilter(brandFilter.filter((x) => x !== b))}
                    className="px-2 py-1 text-[10px] bg-gray-200 hover:bg-gray-300 font-medium"
                  >
                    {b} ✕
                  </button>
                ))}
                {categoryFilter && (
                  <button
                    onClick={() => setCategoryFilter("")}
                    className="px-2 py-1 text-[10px] bg-gray-200 hover:bg-gray-300 font-medium"
                  >
                    {categoryFilter} ✕
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
              {filteredListings.map((listing) => {
                const favorited = user ? isFavorited(user.id, listing.id) : false;
                const hasSalePrice = listing.sale_price && listing.sale_price < listing.listed_price;
                const hasOriginalDiscount = listing.original_price && listing.original_price > listing.listed_price;
                const hasDiscount = hasSalePrice || hasOriginalDiscount;
                const discountPct = listing.discount
                  ? Math.round(listing.discount)
                  : hasSalePrice
                    ? Math.round((1 - listing.sale_price! / listing.listed_price) * 100)
                    : hasOriginalDiscount
                      ? Math.round((1 - listing.listed_price / listing.original_price!) * 100)
                      : null;
                const displayPrice = hasSalePrice ? listing.sale_price! : listing.listed_price;
                const strikethroughPrice = hasSalePrice ? listing.listed_price : listing.original_price;

                return (
                  <div key={listing.id} className="group flex flex-col cursor-pointer">
                    {/* Image */}
                    <Link href={`/listing/${listing.id}`} className="relative block overflow-hidden aspect-square bg-[#F0F0F0]">
                      {listing.image_url[0] && (
                        <img
                          src={listing.image_url[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=60";
                          }}
                        />
                      )}
                    </Link>

                    {/* Card info — Grailed style */}
                    <div className="mt-[6px] flex flex-col gap-0">
                      {/* Brand row: brand left, size right */}
                      <div className="flex items-baseline justify-between gap-1">
                        <p className="text-[11px] font-bold tracking-[0.07em] text-[#1A1A1A] uppercase truncate leading-tight">
                          {listing.brand}
                        </p>
                        <span className="text-[10px] text-[#888] font-normal flex-shrink-0 uppercase tracking-[0.05em]">
                          {listing.size}
                        </span>
                      </div>

                      {/* Title */}
                      <p className="text-[12px] text-[#1A1A1A] leading-snug line-clamp-1 mt-[1px]">
                        {listing.title}
                      </p>

                      {/* Price row + heart */}
                      <div className="flex items-center justify-between mt-[3px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {hasDiscount ? (
                            <>
                              <span className="text-[12px] font-bold text-[#C62828]">${displayPrice.toLocaleString()}</span>
                              {strikethroughPrice && <span className="text-[11px] text-[#888] line-through">${strikethroughPrice.toLocaleString()}</span>}
                              {discountPct && <span className="text-[10px] text-[#888]">{discountPct}% off</span>}
                            </>
                          ) : (
                            <span className="text-[12px] font-bold text-[#1A1A1A]">${listing.listed_price.toLocaleString()}</span>
                          )}
                        </div>
                        {/* Heart button */}
                        {user && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(user.id, listing.id);
                            }}
                            className="flex-shrink-0 ml-1 p-0.5 text-[#888] hover:text-[#1A1A1A] transition-colors"
                            aria-label="Save"
                          >
                            <Heart
                              className="w-[15px] h-[15px]"
                              fill={favorited ? "#1A1A1A" : "none"}
                              stroke={favorited ? "#1A1A1A" : "#888"}
                              strokeWidth={1.5}
                            />
                          </button>
                        )}
                      </div>

                      {/* Location */}
                      <p className="text-[10px] text-[#888] mt-[2px]">Located in United States</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
