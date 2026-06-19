"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { useProfiles } from "@/lib/use-profiles";
import { Heart, Bookmark, ChevronLeft, ChevronRight, Star } from "lucide-react";
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
          <div className="space-y-4">

            {/* Brand + title row with bookmark + heart icons */}
            <div>
              <p className="text-[13px] font-bold text-[#1A1A1A] mb-0.5">{listing.brand}</p>
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-[16px] font-bold text-[#1A1A1A] leading-snug flex-1">{listing.title}</h1>
                {/* Bookmark + Heart icons */}
                <div className="flex items-center gap-3 flex-shrink-0 mt-0.5">
                  <button
                    onClick={() => { if (!user) { openLoginModal("login"); return; } }}
                    className="flex flex-col items-center hover:opacity-70 transition-opacity"
                    aria-label="Save listing"
                  >
                    <Bookmark
                      className="w-[20px] h-[20px]"
                      fill="none"
                      stroke="#1A1A1A"
                      strokeWidth={1.5}
                    />
                  </button>
                  <button
                    onClick={() => {
                      if (!user) { openLoginModal("login"); return; }
                      toggleFavorite(user.id, listing.id);
                    }}
                    className="flex flex-col items-center hover:opacity-70 transition-opacity"
                    aria-label="Favorite listing"
                  >
                    <Heart
                      className="w-[20px] h-[20px]"
                      fill={user && isFavorited(user.id, listing.id) ? "#1A1A1A" : "none"}
                      stroke="#1A1A1A"
                      strokeWidth={1.5}
                    />
                    <span className="text-[10px] text-[#888] leading-none mt-0.5">
                      {listing.watchers_count ?? 0}
                    </span>
                  </button>
                </div>
              </div>

              {/* Metadata row: size · condition · location */}
              <p className="text-[12px] text-[#888] mt-1.5">
                {listing.size && <>{listing.size} · </>}
                {listing.condition && <>{listing.condition} · </>}
                Located in United States
              </p>
            </div>

            {/* Price + shipping */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-[28px] font-bold text-[#1A1A1A]">
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
              <p className="text-[12px] text-[#888] mt-0.5">+ $15.99 Shipping — US to <span className="underline cursor-pointer">United States</span> ▾</p>

              {/* Price context row — hidden for now, enabling next week */}
              {/* <p className="text-[11px] text-[#888] mb-4">
                Lowest ask (30d): ${lowestAsk} · Last sold: ${lastSold} · Acceptance: {acceptanceRate}%
              </p> */}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleOpenOffer}
                disabled={hasOffer}
                className={`w-full py-3.5 text-[13px] font-bold tracking-[0.12em] transition-colors ${
                  hasOffer
                    ? "bg-[#888] text-white cursor-not-allowed"
                    : "bg-[#1A1A1A] text-white hover:bg-black"
                }`}
              >
                PURCHASE
              </button>

              {hasOffer ? (
                <div className="w-full py-3 border border-[#1A1A1A] text-[13px] font-bold tracking-[0.12em] text-center text-[#1A1A1A]">
                  OFFER SENT ✓
                </div>
              ) : (
                <button
                  onClick={handleOpenOffer}
                  className="w-full py-3 border border-[#D4D4D4] text-[13px] font-bold tracking-[0.12em] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                >
                  Make Offer
                </button>
              )}

              <button
                onClick={() => { if (!user) { openLoginModal("login"); return; } alert("Message seller — Demo"); }}
                className="w-full py-3 border border-[#D4D4D4] text-[13px] font-bold tracking-[0.12em] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
              >
                MESSAGE
              </button>

              {!user && (
                <p className="text-[11px] text-center text-[#888]">Log in to buy or make an offer</p>
              )}
            </div>

            {/* Grailed Pro teaser — buyer side */}
            <p className="text-[11px] text-center text-[#888]">
              <span className="font-semibold text-[#1A1A1A]">Grailed Pro</span> — coming soon
            </p>

            {/* Seller Description */}
            {listing.description && (
              <div className="border-t border-[#E8E8E8] pt-4">
                <p className="text-[13px] font-bold text-[#1A1A1A] mb-2">Seller Description</p>
                <p className="text-[13px] text-[#555] leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* Color / tags */}
            <div className="border-t border-[#E8E8E8] pt-3 flex items-center gap-2">
              {listing.category && (
                <>
                  <span className="w-3 h-3 rounded-full bg-[#9CA3AF] inline-block"></span>
                  <span className="text-[12px] text-[#555]">
                    {listing.category} · {listing.condition || "Luxury"}
                  </span>
                </>
              )}
            </div>

            {/* ── Seller Block ── */}
            <div className="border-t border-[#E8E8E8] pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar circle */}
                  <div className="w-10 h-10 rounded-full bg-[#E8E8E8] flex-shrink-0 flex items-center justify-center">
                    <span className="text-[13px] font-bold text-[#888] uppercase select-none">
                      {(seller?.name || "S")[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-[13px] font-bold text-[#1A1A1A] hover:underline truncate block leading-tight uppercase tracking-[0.04em]"
                    >
                      {seller?.name || "Unknown Seller"}
                    </a>
                    {/* Star rating row */}
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1,2,3,4,5].map((star) => (
                        <Star
                          key={star}
                          className="w-3 h-3"
                          fill={star <= 4 ? "#f59e0b" : "none"}
                          stroke="#f59e0b"
                          strokeWidth={1.5}
                        />
                      ))}
                      <span className="text-[11px] text-[#888] ml-0.5">2 Reviews</span>
                    </div>
                    <p className="text-[11px] text-[#888] mt-0.5">
                      {seller?.transaction_count ?? 11} Transactions ·{" "}
                      <a href="#" onClick={(e) => e.preventDefault()} className="underline hover:text-[#1A1A1A]">
                        {seller?.transaction_count ? seller.transaction_count * 20 : 238} items for sale
                      </a>
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="flex-shrink-0 px-5 py-2 bg-[#1A1A1A] text-[11px] font-bold tracking-[0.08em] text-white hover:bg-black transition-colors"
                >
                  FOLLOW
                </button>
              </div>
            </div>

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
