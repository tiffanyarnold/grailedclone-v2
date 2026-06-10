"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { useProfiles } from "@/lib/use-profiles";
import { Heart } from "lucide-react";
import OfferModal from "@/components/listing/OfferModal";

export default function ListingDetailPage() {
  const params = useParams();
  const { listings, addOffer, toggleFavorite, isFavorited } = useStore();
  const { user, openLoginModal } = useAuth();
  const { getProfileById } = useProfiles();
  const [selectedImage, setSelectedImage] = useState(0);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerDone, setOfferDone] = useState(false);

  const listing = listings.find((l) => l.id === params.id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-gray-500">Listing not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const seller = getProfileById(listing.seller_id);
  const lowestAsk = Math.round(listing.price * 0.82);
  const lastSold = Math.round(listing.price * 0.9);
  const acceptanceRate = 67;

  const handleOpenOffer = () => {
    if (!user) {
      openLoginModal("login");
      return;
    }
    setOfferModalOpen(true);
  };

  const handleSubmitOffer = async (amount: number) => {
    if (!user) return;
    await addOffer({
      listing_id: listing.id,
      buyer_id: user.id,
      amount,
      status: "pending",
    });
    setOfferDone(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">

          {/* Left: Image Gallery */}
          <div>
            <div className="aspect-square bg-white overflow-hidden mb-3">
              <img
                src={listing.images[selectedImage]}
                alt={listing.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 border-2 overflow-hidden ${
                    i === selectedImage ? "border-[#1A1A1A]" : "border-transparent"
                  } hover:scale-105 transition-transform`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info + CTA */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] tracking-[0.12em] uppercase text-gray-500 mb-1">{listing.brand}</p>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-2">{listing.title}</h1>
              <p className="text-2xl font-bold text-[#1A1A1A] mb-1">${listing.price.toLocaleString()}</p>

              <p className="text-xs text-gray-500 mb-4">
                Lowest ask in 30 days: ${lowestAsk} · Last sold: ${lastSold} · Acceptance rate: {acceptanceRate}%
              </p>

              <div className="space-y-2 text-sm text-gray-700 border-t border-[#D4D4D4] pt-4">
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Size</span>
                  <span className="text-xs">{listing.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Condition</span>
                  <span className="text-xs">{listing.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
                  <span className="text-xs">{listing.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Seller</span>
                  <span className="text-xs">{seller?.name || "Unknown"}</span>
                </div>
              </div>

              <div className="border-t border-[#D4D4D4] pt-4 mt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
              </div>
            </div>

            {user && (
              <button
                onClick={() => toggleFavorite(user.id, listing.id)}
                className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited(user.id, listing.id) ? "fill-red-500 text-red-500" : "text-gray-500"
                  }`}
                />
                <span>{isFavorited(user.id, listing.id) ? "Saved" : "Save"}</span>
              </button>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleOpenOffer}
                className="w-full py-4 bg-[#1A1A1A] text-white text-[13px] font-bold tracking-[0.12em] hover:bg-black transition-colors"
              >
                BUY NOW
              </button>

              {offerDone ? (
                <div className="w-full py-3.5 border border-[#1A1A1A] text-[13px] font-bold tracking-[0.12em] text-center text-[#1A1A1A]">
                  OFFER SENT
                </div>
              ) : (
                <button
                  onClick={handleOpenOffer}
                  className="w-full py-3.5 border border-[#1A1A1A] text-[13px] font-bold tracking-[0.12em] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                >
                  MAKE OFFER
                </button>
              )}

              {!user && (
                <p className="text-[11px] text-center text-[#888]">
                  Log in to buy or make an offer
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {offerModalOpen && (
        <OfferModal
          listing={listing}
          onClose={() => setOfferModalOpen(false)}
          onSubmit={handleSubmitOffer}
        />
      )}
    </div>
  );
}
