"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { isOfferCompetitive } from "@/lib/data";
import { useProfiles } from "@/lib/use-profiles";
import { Heart, Lock } from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { listings, addOffer, toggleFavorite, isFavorited } = useStore();
  const { user } = useAuth();
  const { getProfileById } = useProfiles();
  const [selectedImage, setSelectedImage] = useState(0);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerSubmitted, setOfferSubmitted] = useState(false);

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
  const offerNum = parseFloat(offerAmount);
  const isValidOffer = !isNaN(offerNum) && offerNum >= 1 && offerNum <= 9999;
  const competitive = isValidOffer ? isOfferCompetitive(offerNum, listing.price) : null;

  // Static price context data
  const lowestAsk = Math.round(listing.price * 0.82);
  const lastSold = Math.round(listing.price * 0.9);
  const acceptanceRate = 67;

  const handleSubmitOffer = async () => {
    if (!user || !isValidOffer) return;
    await addOffer({
      listing_id: listing.id,
      buyer_id: user.id,
      amount: offerNum,
      status: "pending",
    });
    setOfferSubmitted(true);
    setTimeout(() => setOfferSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-6 py-8">
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
            <div className="flex gap-2">
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

          {/* Right: Product Info + Offer Panel */}
          <div className="space-y-6">
            {/* Product Info */}
            <div>
              <p className="text-[10px] tracking-[0.12em] uppercase text-gray-500 mb-1">{listing.brand}</p>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-2">{listing.title}</h1>
              <p className="text-2xl font-bold text-[#1A1A1A] mb-1">${listing.price.toLocaleString()}</p>

              {/* Price Context */}
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

            {/* Favorite */}
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

            {/* Offer Panel */}
            <div className="border border-[#D4D4D4] p-5 bg-white">
              <h3 className="text-sm font-bold mb-3">Make an Offer</h3>

              {!user ? (
                <div>
                  <p className="text-xs text-gray-500 mb-3">Log in to make an offer on this item.</p>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black transition-colors"
                  >
                    LOG IN TO OFFER
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="Enter offer amount"
                      value={offerAmount}
                      onChange={(e) => {
                        setOfferAmount(e.target.value);
                        setOfferSubmitted(false);
                      }}
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-300 text-sm outline-none focus:border-[#1A1A1A]"
                    />
                  </div>

                  {/* Offer Strength Badge */}
                  {offerAmount && isValidOffer && (
                    <div
                      className="flex items-center gap-2 animate-in fade-in duration-150"
                      style={{ transform: "scale(1)", transition: "transform 0.15s ease-out" }}
                    >
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-sm ${
                          competitive
                            ? "bg-green-100 text-[#16A34A]"
                            : "bg-red-100 text-[#DC2626]"
                        }`}
                      >
                        {competitive ? "Competitive" : "Low"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {competitive
                          ? "Your offer is within the typical accepted range for this item."
                          : "Offers this far below the asking price are rarely accepted on Grailed."}
                      </span>
                    </div>
                  )}

                  {offerAmount && !isValidOffer && offerAmount !== "" && (
                    <p className="text-xs text-[#DC2626]">Enter a valid offer between $1–$9999.</p>
                  )}

                  {offerSubmitted && (
                    <div className="flex items-center gap-2 text-xs text-[#16A34A] font-medium animate-in fade-in">
                      ✓ Offer submitted successfully!
                    </div>
                  )}

                  <button
                    onClick={handleSubmitOffer}
                    disabled={!isValidOffer || offerSubmitted}
                    className="w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {offerSubmitted ? "OFFER SENT" : "SUBMIT OFFER"}
                  </button>
                </div>
              )}

              {/* Pro Badge */}
              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-[#F0F0F0] rounded-sm">
                <Lock className="w-3 h-3 text-[#9CA3AF]" />
                <span className="text-[10px] text-[#9CA3AF] font-medium">Pro — Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
