"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { useProfiles } from "@/lib/use-profiles";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import OfferModal from "@/components/listing/OfferModal";

export default function ListingDetailPage() {
  const params = useParams();
  const { listings, offers, isLoading: storeLoading, addOffer, toggleFavorite, isFavorited } = useStore();
  const { user, openLoginModal } = useAuth();
  const { getProfileById } = useProfiles();
  const [selectedImage, setSelectedImage] = useState(0);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerDone, setOfferDone] = useState(false);

  const listing = listings.find((l) => l.id === params.id);

  // Show a spinner while the store is fetching — prevents a false "not found"
  // when deep-linking directly to a listing URL before data has loaded.
  if (storeLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-[13px] text-[#888]">Loading…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-gray-500">Listing not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const seller = getProfileById(listing.seller_id);

  // Check if this buyer already has a pending or accepted offer on this listing
  // so we don't let them submit a second one after navigating away and back.
  const existingOffer = user
    ? offers.find((o) => o.listing_id === listing.id && o.buyer_id === user.id)
    : undefined;
  // offerDone is also set locally after a fresh submission this session
  const hasOffer = offerDone || !!existingOffer;

  const lowestAsk = listing.lowest_ask || Math.round(listing.listed_price * 0.82);
  const lastSold = listing.last_sold_price || Math.round(listing.listed_price * 0.9);
  const acceptanceRate = listing.offer_acceptance_rate || 67;

  // Discount: use sale_price/discount columns if available, fall back to original_price calculation
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

  const images = listing.image_url.length > 0
    ? listing.image_url
    : ["https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80"];

  const prevImage = () => setSelectedImage((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setSelectedImage((i) => (i + 1) % images.length);

  const handleOpenOffer = () => {
    if (!user) { openLoginModal("login"); return; }
    // Don't open a second offer if one is already pending/accepted
    if (hasOffer) return;
    setOfferModalOpen(true);
  };

  const handleSubmitOffer = async (amount: number) => {
    if (!user) return;
    try {
      await addOffer({ listing_id: listing.id, buyer_id: user.id, amount, status: "pending" });
      setOfferDone(true);
    } catch (err) {
      console.error("Offer submission failed:", err);
      // Surface the error — OfferModal's onSubmit already shows a success screen
      // only after this resolves, so we re-throw so it stays on the modal.
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}>
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Breadcrumb */}
        <nav className="text-[11px] text-[#888] mb-5 flex flex-wrap items-center gap-1">
          <a href="/browse" className="hover:underline">{listing.category}</a>
          <span>›</span>
          <a href="/browse" className="hover:underline">{listing.brand}</a>
          <span>›</span>
          <span className="text-[#1A1A1A]">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[88px_1fr_380px] gap-3 lg:gap-5">

          {/* ── Col 1: Vertical thumbnail strip ── */}
          <div className="hidden lg:flex flex-col gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-[88px] h-[88px] flex-shrink-0 overflow-hidden border-2 transition-all ${
                  i === selectedImage
                    ? "border-[#1A1A1A]"
                    : "border-transparent hover:border-[#C8C8C8]"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }} />
              </button>
            ))}
          </div>

          {/* ── Col 2: Main image ── */}
          <div>
            <div className="relative bg-[#F2F2F2] overflow-hidden aspect-square">
              <img
                src={images[selectedImage]}
                alt={listing.title}
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=60"; }}
              />

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-[#1A1A1A]/60 text-white text-[10px] px-2 py-0.5 rounded-sm">
                    {selectedImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Mobile: horizontal thumbnail strip */}
            {images.length > 1 && (
              <div className="flex lg:hidden gap-2 mt-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-14 h-14 flex-shrink-0 overflow-hidden border-2 transition-all ${
                      i === selectedImage ? "border-[#1A1A1A]" : "border-transparent hover:border-[#C8C8C8]"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Col 3: Info + CTA ── */}
          <div className="space-y-5">

            {/* Brand + title + price */}
            <div>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#888] mb-1">{listing.brand}</p>
              <h1 className="text-[20px] font-bold text-[#1A1A1A] leading-snug mb-3">{listing.title}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-[26px] font-bold text-[#1A1A1A]">
                  ${displayPrice.toLocaleString()}
                </span>
                {hasDiscount && strikethroughPrice && (
                  <>
                    <span className="text-[17px] text-[#888] line-through">
                      ${strikethroughPrice.toLocaleString()}
                    </span>
                    {discountPct && (
                      <span className="text-[13px] font-bold text-[#C62828]">
                        {discountPct}% off
                      </span>
                    )}
                  </>
                )}
              </div>

              <p className="text-[11px] text-[#888] mb-4">
                Lowest ask (30d): ${lowestAsk} · Last sold: ${lastSold} · Acceptance: {acceptanceRate}%
              </p>

              {/* Details list */}
              <div className="border-t border-[#E8E8E8] pt-4 space-y-2.5">
                {[
                  { label: "Size", value: listing.size },
                  { label: "Condition", value: listing.condition },
                  { label: "Category", value: listing.category },
                  { label: "Seller", value: seller?.name || "Unknown" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.08em]">{label}</span>
                    <span className="text-[13px] text-[#1A1A1A]">{value}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              {listing.description && (
                <div className="border-t border-[#E8E8E8] pt-4 mt-4">
                  <p className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.08em] mb-2">
                    Seller Description
                  </p>
                  <p className="text-[13px] text-[#555] leading-relaxed">{listing.description}</p>
                </div>
              )}
            </div>

            {/* Save */}
            {user && (
              <button
                onClick={() => toggleFavorite(user.id, listing.id)}
                className="flex items-center gap-2 text-[12px] hover:opacity-70 transition-opacity"
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFavorited(user.id, listing.id) ? "#1A1A1A" : "none"}
                  stroke="#1A1A1A"
                  strokeWidth={1.5}
                />
                <span>{isFavorited(user.id, listing.id) ? "Saved" : "Save"}</span>
              </button>
            )}

            {/* CTA */}
            <div className="space-y-2.5">
              <button
                onClick={handleOpenOffer}
                disabled={hasOffer}
                className={`w-full py-4 text-[13px] font-bold tracking-[0.12em] transition-colors ${
                  hasOffer
                    ? "bg-[#888] text-white cursor-not-allowed"
                    : "bg-[#1A1A1A] text-white hover:bg-black"
                }`}
              >
                PURCHASE
              </button>

              {hasOffer ? (
                <div className="w-full py-3.5 border border-[#1A1A1A] text-[13px] font-bold tracking-[0.12em] text-center text-[#1A1A1A]">
                  OFFER SENT ✓
                </div>
              ) : (
                <button
                  onClick={handleOpenOffer}
                  className="w-full py-3.5 border border-[#1A1A1A] text-[13px] font-bold tracking-[0.12em] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                >
                  OFFER
                </button>
              )}

              <button
                onClick={() => { if (!user) { openLoginModal("login"); return; } alert("Message seller — Demo"); }}
                className="w-full py-3.5 border border-[#D4D4D4] text-[13px] font-bold tracking-[0.12em] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
              >
                MESSAGE
              </button>

              {!user && (
                <p className="text-[11px] text-center text-[#888]">Log in to buy or make an offer</p>
              )}
            </div>

            <p className="text-[11px] text-[#888]">+ Shipping calculated at checkout · United States</p>
          </div>

        </div>
      </main>

      <Footer />

      {offerModalOpen && (
        <OfferModal
          listing={listing}
          buyerName={user?.name}
          sellerName={seller?.name}
          onClose={() => setOfferModalOpen(false)}
          onSubmit={handleSubmitOffer}
        />
      )}
    </div>
  );
}
