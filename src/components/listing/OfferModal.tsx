"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, Shield, CreditCard } from "lucide-react";

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

const SHIPPING_ESTIMATE = 14.99;
const TAX_RATE = 0.0895; // ~9% estimated tax

export default function OfferModal({ listing, onClose, onSubmit }: OfferModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [offerAmount, setOfferAmount] = useState("");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [saveCard, setSaveCard] = useState(true);
  const [billingSame, setBillingSame] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const offerNum = parseFloat(offerAmount) || 0;
  const isValidOffer = offerNum > 0 && offerNum <= 99999;
  const estimatedTax = isValidOffer ? Math.round(offerNum * TAX_RATE * 100) / 100 : 0;
  const offerTotal = isValidOffer ? offerNum + SHIPPING_ESTIMATE + estimatedTax : 0;

  const handleReviewOffer = () => {
    if (isValidOffer) setStep(2);
  };

  const handleSubmit = () => {
    if (!tosAccepted || !isValidOffer) return;
    onSubmit(offerNum);
    setSubmitted(true);
  };

  if (!mounted) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal container */}
      <div
        className="relative bg-white w-full shadow-2xl overflow-hidden"
        style={{
          maxWidth: step === 2 ? "680px" : "520px",
          maxHeight: "92vh",
          overflowY: "auto",
          fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── STEP 1 ── */}
        {step === 1 && !submitted && (
          <>
            {/* Header */}
            <div className="relative flex items-center justify-center px-12 py-4 border-b border-[#E8E8E8]">
              <h2 className="text-[15px] font-semibold text-[#1A1A1A] tracking-[0.01em]">
                Step 1 of 2: Make an Offer
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1A1A1A] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 py-6">
              {/* Listing summary card */}
              <div className="flex items-center gap-4 pb-5 border-b border-[#E8E8E8] mb-6">
                <div className="w-[60px] h-[60px] bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
                  {listing.image_url[0] && (
                    <img src={listing.image_url[0]} alt={listing.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#1A1A1A] truncate">{listing.brand}</p>
                  <p className="text-[13px] text-[#1A1A1A] truncate">{listing.title}</p>
                  <p className="text-[12px] text-[#888]">{listing.size}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[15px] font-bold text-[#1A1A1A]">${listing.listed_price.toLocaleString()}</p>
                </div>
              </div>

              {/* Offer Price label */}
              <p className="text-[13px] font-semibold text-[#1A1A1A] text-center mb-4 tracking-[0.02em]">
                Offer Price
              </p>

              {/* Large centered dollar input — matches Grailed screenshot exactly */}
              <div className="flex items-center justify-center mb-3">
                <div className="relative flex items-center border-b-2 border-[#1A1A1A] pb-1 px-2" style={{ minWidth: "200px" }}>
                  <span className="text-[28px] font-normal text-[#BBBBBB] mr-1 select-none">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="text-[32px] font-light text-[#888] outline-none bg-transparent w-full text-center placeholder:text-[#BBBBBB]"
                    style={{ minWidth: "120px" }}
                    autoFocus
                  />
                </div>
              </div>

              {/* Helper texts */}
              <p className="text-[12px] text-[#888] text-center mb-2">
                Shipping and taxes calculated in the next step
              </p>
              <p className="text-[12px] text-[#888] text-center mb-7">
                The seller has 24 hours to accept this offer
              </p>

              {/* Review Offer button — gray when disabled, black when valid */}
              <button
                onClick={handleReviewOffer}
                disabled={!isValidOffer}
                className={`w-full py-[14px] text-[13px] font-semibold tracking-[0.08em] transition-colors ${
                  isValidOffer
                    ? "bg-[#1A1A1A] text-white hover:bg-black cursor-pointer"
                    : "bg-[#E8E8E8] text-[#AAAAAA] cursor-not-allowed"
                }`}
              >
                REVIEW OFFER
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && !submitted && (
          <>
            {/* Header with back arrow + centered title + X */}
            <div className="relative flex items-center justify-center px-12 py-4 border-b border-[#E8E8E8]">
              <button
                onClick={() => setStep(1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A] hover:opacity-60 transition-opacity p-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-[15px] font-semibold text-[#1A1A1A] tracking-[0.01em]">
                Step 2 of 2: Review Offer
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1A1A1A] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Two-column layout */}
            <div className="flex flex-col lg:flex-row">
              {/* LEFT column: Shipping + Payment */}
              <div className="flex-1 px-6 py-6 border-b lg:border-b-0 lg:border-r border-[#E8E8E8]">
                {/* Shipping Address */}
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] mb-3">Shipping Address</h3>
                <div className="border border-[#D4D4D4] px-4 py-3 mb-5 flex items-start justify-between cursor-pointer hover:border-[#888] transition-colors">
                  <div>
                    <p className="text-[13px] text-[#1A1A1A] font-medium">Jillian J Krebsbach</p>
                    <p className="text-[12px] text-[#444]">34-06 45th Street</p>
                    <p className="text-[12px] text-[#444]">1G</p>
                    <p className="text-[12px] text-[#444]">Long Island City, NY 11101</p>
                    <p className="text-[12px] text-[#444]">United States</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#888] rotate-180 mt-1 flex-shrink-0" />
                </div>

                {/* Select Your Payment Method */}
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] mb-3">Select Your Payment Method</h3>

                {/* Card button — selected */}
                <div className="border-2 border-[#1A1A1A] px-4 py-2.5 flex items-center gap-2.5 mb-4 w-fit">
                  <CreditCard className="w-4 h-4 text-[#1A1A1A]" />
                  <span className="text-[13px] font-semibold text-[#1A1A1A]">Card</span>
                </div>

                {/* Card number input */}
                <div className="border border-[#D4D4D4] px-4 py-3 flex items-center gap-3 mb-4">
                  <div className="w-8 h-5 bg-[#E8E8E8] rounded-sm flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Card number"
                    className="flex-1 text-[13px] text-[#888] outline-none bg-transparent placeholder:text-[#BBBBBB]"
                  />
                  <span className="text-[12px] text-[#BBBBBB]">MM / YY  CVC</span>
                </div>

                {/* Checkboxes */}
                <label className="flex items-center gap-2.5 mb-3 cursor-pointer group">
                  <div
                    onClick={() => setBillingSame((v) => !v)}
                    className={`w-[18px] h-[18px] flex-shrink-0 border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      billingSame ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#D4D4D4]"
                    }`}
                  >
                    {billingSame && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-[2px]">
                        <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-[#1A1A1A]">Billing address same as shipping address</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setSaveCard((v) => !v)}
                    className={`w-[18px] h-[18px] flex-shrink-0 border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      saveCard ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#D4D4D4]"
                    }`}
                  >
                    {saveCard && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-[2px]">
                        <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-[#1A1A1A]">Save card securely for future use</span>
                </label>
              </div>

              {/* RIGHT column: Listing + Offer Details + Submit */}
              <div className="flex-1 px-6 py-6">
                {/* Listing card */}
                <div className="border border-[#E8E8E8] p-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-[56px] h-[56px] bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
                      {listing.image_url[0] && (
                        <img src={listing.image_url[0]} alt={listing.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[#1A1A1A]">{listing.brand}</p>
                      <p className="text-[12px] text-[#1A1A1A] truncate">{listing.title}</p>
                      <p className="text-[11px] text-[#888]">Size: {listing.size}</p>
                      <p className="text-[11px] text-[#888]">
                        Seller: <span className="text-[#2557D6] underline cursor-pointer">grailed_seller</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="mb-4">
                  <p className="text-[13px] font-semibold text-[#1A1A1A] mb-3">Offer Details</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#555]">Offer Price</span>
                      <span className="text-[#1A1A1A]">${offerNum.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#555]">Shipping</span>
                      <span className="text-[#1A1A1A]">${SHIPPING_ESTIMATE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#555] flex items-center gap-1">
                        Estimated Tax
                        <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full border border-[#888] text-[9px] text-[#888] cursor-help">i</span>
                      </span>
                      <span className="text-[#1A1A1A]">${estimatedTax.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* OFFER TOTAL */}
                <div className="flex justify-between items-center py-3 border-t border-b border-[#E8E8E8] mb-4">
                  <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#1A1A1A]">OFFER TOTAL</span>
                  <span className="text-[16px] font-bold text-[#1A1A1A]">${offerTotal.toFixed(2)}</span>
                </div>

                {/* TOS checkbox */}
                <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
                  <div
                    onClick={() => setTosAccepted((v) => !v)}
                    className={`mt-[2px] w-[18px] h-[18px] flex-shrink-0 border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      tosAccepted ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#D4D4D4]"
                    }`}
                  >
                    {tosAccepted && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-[2px]">
                        <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[12px] text-[#555] leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="underline text-[#555] hover:text-[#1A1A1A]">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="underline text-[#555] hover:text-[#1A1A1A]">Purchase Protection Policy</a>.
                  </span>
                </label>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={!tosAccepted}
                  className={`w-full py-[14px] text-[13px] font-semibold tracking-[0.08em] transition-colors mb-5 ${
                    tosAccepted
                      ? "bg-[#1A1A1A] text-white hover:bg-black cursor-pointer"
                      : "bg-[#E8E8E8] text-[#AAAAAA] cursor-not-allowed"
                  }`}
                >
                  SUBMIT OFFER
                </button>

                {/* Grailed Purchase Protection */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield className="w-[15px] h-[15px] text-[#1A1A1A]" />
                    <p className="text-[13px] font-semibold text-[#1A1A1A]">Grailed Purchase Protection</p>
                  </div>
                  <p className="text-[12px] text-[#555] leading-relaxed mb-2">
                    This offer is binding and expires after 24 hours. If the seller accepts this offer, your payment will be processed.{" "}
                    <a href="#" className="underline hover:opacity-70">Learn more</a>.
                  </p>
                  <p className="text-[12px] text-[#555] leading-relaxed">
                    Buy with confidence. Qualifying orders are covered by our Purchase Protection in the rare case something goes wrong.{" "}
                    <a href="#" className="underline hover:opacity-70">Learn more</a>
                  </p>
                </div>

                {/* Taxes & Tariffs */}
                <div>
                  <p className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5">Taxes & Tariffs</p>
                  <p className="text-[12px] text-[#555] leading-relaxed">
                    Tax is calculated based on your shipping address and applicable local rates. Tariffs may apply for international orders.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── SUCCESS ── */}
        {submitted && (
          <div className="px-8 py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <polyline points="4,12 9,17 20,7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-2">Offer Sent!</h3>
            <p className="text-[13px] text-[#888] mb-7 max-w-[300px] mx-auto leading-relaxed">
              Your offer of{" "}
              <strong className="text-[#1A1A1A]">${offerNum.toLocaleString()}</strong>{" "}
              has been submitted. The seller has 24 hours to respond.
            </p>
            <button
              onClick={onClose}
              className="px-10 py-3.5 bg-[#1A1A1A] text-white text-[12px] font-semibold tracking-[0.1em] hover:bg-black transition-colors"
            >
              DONE
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
