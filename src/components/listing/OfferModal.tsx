"use client";

import { useState } from "react";
import { X, Shield, ChevronRight } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  brand: string;
  size: string;
  listed_price: number;
  image_url: string[];
  condition: string;
}

interface OfferModalProps {
  listing: Listing;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

const GRAILED_FEE_RATE = 0.09; // 9%
const PAYMENT_FEE_RATE = 0.03; // ~3%
const SHIPPING_ESTIMATE = 10;

export default function OfferModal({ listing, onClose, onSubmit }: OfferModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [offerAmount, setOfferAmount] = useState("");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MIN_OFFER = Math.ceil(listing.listed_price * 0.7); // must be at least 70% of price
  const offerNum = parseFloat(offerAmount);
  const isTooLow = !isNaN(offerNum) && offerNum < MIN_OFFER;
  const isValidOffer = !isNaN(offerNum) && offerNum >= MIN_OFFER && offerNum <= 9999;

  const grailedFee = isValidOffer ? Math.round(offerNum * GRAILED_FEE_RATE * 100) / 100 : 0;
  const paymentFee = isValidOffer ? Math.round(offerNum * PAYMENT_FEE_RATE * 100) / 100 : 0;
  const offerTotal = isValidOffer ? offerNum + SHIPPING_ESTIMATE + grailedFee + paymentFee : 0;

  const handleReviewOffer = () => {
    if (isValidOffer) setStep(2);
  };

  const handleSubmit = () => {
    if (!tosAccepted) return;
    onSubmit(offerNum);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-[560px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8] sticky top-0 bg-white z-10">
          <h2 className="text-[15px] font-bold tracking-[0.02em] text-[#1A1A1A]">
            {step === 1 ? "Make an Offer" : "Review Offer"}
          </h2>
          <button onClick={onClose} className="text-[#888] hover:text-[#1A1A1A] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="p-6">
            {/* Listing summary */}
            <div className="flex items-center gap-4 pb-5 border-b border-[#E8E8E8] mb-6">
              <div className="w-[72px] h-[72px] bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
                <img src={listing.image_url[0]} alt={listing.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.1em] text-[#888] mb-0.5">{listing.brand}</p>
                <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">{listing.title}</p>
                <p className="text-[12px] text-[#888] mt-0.5">Size: {listing.size}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[11px] text-[#888] mb-0.5">Listed price</p>
                <p className="text-[16px] font-bold text-[#1A1A1A]">${listing.listed_price.toLocaleString()}</p>
              </div>
            </div>

            {/* Offer input */}
            <div className="mb-2">
              <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A] mb-3">
                Your Offer
              </label>
              <div className="relative">
                <span className="absolute left-0 bottom-0 top-0 flex items-center pl-3 text-[18px] font-semibold text-[#1A1A1A] pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className={`w-full pl-7 pr-3 py-3 text-[22px] font-semibold text-[#1A1A1A] outline-none border-b-2 bg-transparent placeholder:text-[#D4D4D4] ${
                    isTooLow ? "border-[#DC2626]" : isValidOffer ? "border-[#1A1A1A]" : "border-[#D4D4D4]"
                  }`}
                />
              </div>
            </div>

            {/* Validation message */}
            {isTooLow && (
              <p className="text-[12px] text-[#DC2626] mt-1 mb-4">
                Your offer is too low. Must be ${MIN_OFFER.toLocaleString()} or higher.
              </p>
            )}
            {!offerAmount && (
              <p className="text-[12px] text-[#888] mt-1 mb-4">
                Minimum offer: ${MIN_OFFER.toLocaleString()}
              </p>
            )}
            {isValidOffer && (
              <p className="text-[12px] text-[#888] mt-1 mb-4">
                {offerNum >= listing.listed_price * 0.85
                  ? "✓ Competitive offer — likely to be accepted."
                  : "Offers close to the asking price are more likely to be accepted."}
              </p>
            )}

            {/* Review button */}
            <button
              onClick={handleReviewOffer}
              disabled={!isValidOffer}
              className={`w-full py-4 text-[13px] font-bold tracking-[0.12em] transition-colors mt-4 ${
                isValidOffer
                  ? "bg-[#1A1A1A] text-white hover:bg-black"
                  : "bg-[#F2F2F2] text-[#BBBBBB] cursor-not-allowed"
              }`}
            >
              REVIEW OFFER
            </button>

            <p className="text-[11px] text-center text-[#888] mt-3">
              You won&apos;t be charged until the seller accepts.
            </p>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && !submitted && (
          <div className="p-6 lg:flex lg:gap-8">

            {/* LEFT: Shipping Address */}
            <div className="lg:w-[280px] flex-shrink-0 mb-6 lg:mb-0">
              <h3 className="text-[13px] font-bold tracking-[0.06em] uppercase text-[#1A1A1A] mb-4">
                Shipping Address
              </h3>
              <button className="w-full border border-[#DC2626] px-4 py-4 flex items-center justify-between text-[13px] text-[#888] hover:bg-[#FAFAFA] transition-colors">
                <span>Select address</span>
                <ChevronRight className="w-4 h-4 text-[#888]" />
              </button>
              <p className="text-[11px] text-[#888] mt-2 leading-relaxed">
                Add a shipping address to continue. Your address is used to calculate shipping and taxes.
              </p>

              {/* Grailed Purchase Protection */}
              <div className="mt-6 p-4 bg-[#F7F7F7] border border-[#E8E8E8]">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#1A1A1A]" />
                  <p className="text-[12px] font-bold text-[#1A1A1A]">Grailed Purchase Protection</p>
                </div>
                <p className="text-[11px] text-[#888] leading-relaxed">
                  Every order is covered by our Purchase Protection policy. If your item doesn't arrive or isn't as described, we'll make it right.
                </p>
              </div>

              {/* Taxes & Tariffs */}
              <div className="mt-4 p-4 border border-[#E8E8E8]">
                <p className="text-[12px] font-bold text-[#1A1A1A] mb-1">Taxes &amp; Tariffs</p>
                <p className="text-[11px] text-[#888] leading-relaxed">
                  Tax is calculated based on your shipping address and applicable local tax rates. Tariffs may apply to international orders.
                </p>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="flex-1">
              {/* Item card */}
              <div className="flex items-center gap-4 pb-5 border-b border-[#E8E8E8] mb-5">
                <div className="w-[64px] h-[64px] bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
                  <img src={listing.image_url[0]} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.1em] text-[#888] mb-0.5">{listing.brand}</p>
                  <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{listing.title}</p>
                  <p className="text-[12px] text-[#888]">Size: {listing.size} · {listing.condition}</p>
                </div>
              </div>

              {/* Offer Details */}
              <div className="mb-5">
                <h3 className="text-[13px] font-bold tracking-[0.06em] uppercase text-[#1A1A1A] mb-3">
                  Offer Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#888]">Offer Amount</span>
                    <span className="font-medium">${offerNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#888]">Shipping</span>
                    <span className="font-medium">${SHIPPING_ESTIMATE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#888]">Buyer Protection Fee (9%)</span>
                    <span className="font-medium">${grailedFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#888]">Payment Processing (~3%)</span>
                    <span className="font-medium">${paymentFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-[#888] italic text-[11px]">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
              </div>

              {/* Offer Total */}
              <div className="flex justify-between items-center py-4 border-t border-b border-[#E8E8E8] mb-5">
                <span className="text-[14px] font-bold uppercase tracking-[0.06em]">Offer Total</span>
                <span className="text-[18px] font-bold">${offerTotal.toFixed(2)}</span>
              </div>

              {/* TOS checkbox */}
              <label className="flex items-start gap-3 mb-5 cursor-pointer group">
                <div
                  onClick={() => setTosAccepted((v) => !v)}
                  className={`mt-0.5 w-4 h-4 flex-shrink-0 border transition-colors cursor-pointer ${
                    tosAccepted ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#D4D4D4] group-hover:border-[#888]"
                  }`}
                >
                  {tosAccepted && (
                    <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-[2px]">
                      <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[12px] text-[#888] leading-relaxed">
                  By submitting this offer I agree to the{" "}
                  <a href="#" className="underline text-[#1A1A1A] hover:opacity-70">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="underline text-[#1A1A1A] hover:opacity-70">Buyer Policies</a>.
                  If accepted, this offer becomes a binding purchase.
                </span>
              </label>

              {/* Back + Submit */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 text-[12px] font-bold tracking-[0.1em] border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                >
                  BACK
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!tosAccepted}
                  className={`flex-1 py-3.5 text-[13px] font-bold tracking-[0.1em] transition-colors ${
                    tosAccepted
                      ? "bg-[#1A1A1A] text-white hover:bg-black"
                      : "bg-[#F2F2F2] text-[#BBBBBB] cursor-not-allowed"
                  }`}
                >
                  SUBMIT OFFER
                </button>
              </div>

              <p className="text-[11px] text-center text-[#888] mt-3">
                You won&apos;t be charged until the seller accepts your offer.
              </p>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {submitted && (
          <div className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <polyline points="4,12 9,17 20,7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-2">Offer Sent!</h3>
            <p className="text-[13px] text-[#888] mb-6 max-w-[300px] mx-auto">
              Your offer of <strong className="text-[#1A1A1A]">${offerNum.toLocaleString()}</strong> has been submitted. The seller has 24 hours to respond.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#1A1A1A] text-white text-[12px] font-bold tracking-[0.1em] hover:bg-black transition-colors"
            >
              DONE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
