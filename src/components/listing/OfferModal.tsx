"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, Shield, CreditCard, Heart, Lock } from "lucide-react";
import { getOfferLabel, getSellerRating } from "@/lib/data";

interface Listing {
  id: string;
  title: string;
  brand: string;
  size: string;
  listed_price: number;
  sale_price?: number | null;
  discount?: number | null;
  min_offer_price?: number | null;
  competitive_range_min?: number | null;
  competitive_range_max?: number | null;
  watchers_count?: number;
  image_url: string[];
  condition: string;
  seller_id?: string;
}

interface OfferModalProps {
  listing: Listing;
  buyerName?: string;
  sellerName?: string;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
}

const BASE_SHIPPING = 14.99;
const TAX_RATE = 0.0895;

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard", sub: "3 – 5 business days", extra: 0 },
  { id: "ups3day",  label: "UPS 3 Day Ground", sub: "2 – 3 business days", extra: 4.99 },
  { id: "upsnext",  label: "UPS Next Day Air",  sub: "Next business day",   extra: 14.99 },
];

export default function OfferModal({ listing, buyerName, sellerName, onClose, onSubmit }: OfferModalProps) {
  const [mounted, setMounted]       = useState(false);
  const [step, setStep]             = useState<1 | 2>(1);
  const [offerAmount, setOfferAmount] = useState("");
  const [delivery, setDelivery]     = useState("standard");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [saveCard, setSaveCard]     = useState(true);
  const [billingSame, setBillingSame] = useState(true);
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Buyer offer is a whole-dollar integer. No floor logic — any valid integer
  // greater than $1 enables "Review Offer", regardless of the Competitive/Low
  // label (which is informational only).
  const offerNum      = parseInt(offerAmount, 10);
  const hasInput      = offerAmount.trim() !== "";
  const isNumeric     = hasInput && Number.isFinite(offerNum) && offerNum > 0;
  // Non-numeric / junk entry (e.g. "." alone) → field error, no label.
  const showAmountError = hasInput && !isNumeric;
  const isValidOffer  = isNumeric && offerNum > 1 && offerNum <= 99999;

  // Real-time Competitive / Low label, computed from client state (no fetch).
  // Returns null when the item has no competitive_range_min seeded → no label.
  const offerLabel    = isNumeric ? getOfferLabel(offerNum, listing.competitive_range_min) : null;
  const isLow         = offerLabel === "low";
  const rangeMin      = listing.competitive_range_min ?? null;
  const rangeMax      = listing.competitive_range_max ?? listing.listed_price;

  const deliveryExtra = DELIVERY_OPTIONS.find((d) => d.id === delivery)?.extra ?? 0;
  const shipping      = BASE_SHIPPING + deliveryExtra;
  const estimatedTax  = isValidOffer ? Math.round(offerNum * TAX_RATE * 100) / 100 : 0;
  const offerTotal    = isValidOffer ? offerNum + shipping + estimatedTax : 0;

  const handleReviewOffer = () => { if (isValidOffer) setStep(2); };

  const handleSubmit = async () => {
    if (!tosAccepted || !isValidOffer || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(offerNum);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  /* ── shared checkbox ── */
  const Checkbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <div
        onClick={onChange}
        className={`w-[16px] h-[16px] flex-shrink-0 border flex items-center justify-center cursor-pointer transition-colors ${
          checked ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#888]"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-[2px]">
            <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-[12px] text-[#1A1A1A]">{label}</span>
    </label>
  );

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative bg-white w-full shadow-2xl overflow-hidden"
        style={{
          maxWidth: step === 2 ? "740px" : "520px",
          maxHeight: "92vh",
          overflowY: "auto",
          fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ══════════════════ STEP 1 ══════════════════ */}
        {step === 1 && !submitted && (
          <>
            {/* Header */}
            <div className="relative flex items-center justify-center px-12 py-4 border-b border-[#E8E8E8]">
              <h2 className="text-[15px] font-semibold text-[#1A1A1A]">Step 1 of 2: Make an Offer</h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 py-6">
              {/* Listing summary */}
              <div className="flex items-start gap-4 pb-5 border-b border-[#E8E8E8] mb-6">
                <div className="w-[60px] h-[60px] bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
                  {listing.image_url[0] && (
                    <img src={listing.image_url[0]} alt={listing.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Top row: brand + price */}
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className="text-[12px] font-semibold text-[#1A1A1A] truncate">{listing.brand}</p>
                    {/* Price: show sale_price + struck-through original if discounted, else just listed_price */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {listing.sale_price ? (
                        <>
                          <span className="text-[13px] font-bold text-[#1A1A1A]">${listing.sale_price.toLocaleString()}</span>
                          <span className="text-[12px] text-[#C0392B] line-through">${listing.listed_price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-[13px] font-bold text-[#1A1A1A]">${listing.listed_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[12px] text-[#1A1A1A] truncate">{listing.title}</p>
                  {/* Bottom row: size + heart with count */}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[12px] text-[#888]">{listing.size}</p>
                    <div className="flex items-center gap-1 text-[#888]">
                      <Heart className="w-[13px] h-[13px]" strokeWidth={1.5} />
                      <span className="text-[11px]">{listing.watchers_count ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offer Price */}
              <p className="text-[13px] font-semibold text-[#1A1A1A] text-center mb-4 tracking-[0.02em]">
                Offer Price
              </p>

              {/* Dollar input — no spinners */}
              <div className="flex items-center justify-center mb-2">
                <div
                  className="relative flex items-center pb-1 px-2"
                  style={{
                    minWidth: "200px",
                    borderBottom: `2px solid ${isLow ? "#C0392B" : "#1A1A1A"}`,
                  }}
                >
                  <span
                    className="text-[28px] font-normal mr-1 select-none"
                    style={{ color: isLow ? "#C0392B" : "#BBBBBB" }}
                  >
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={offerAmount}
                    onChange={(e) => {
                      // Whole-dollar amounts only — strip anything non-numeric.
                      const v = e.target.value.replace(/[^0-9]/g, "");
                      setOfferAmount(v);
                    }}
                    className="text-[32px] font-light outline-none bg-transparent w-full text-center placeholder:text-[#BBBBBB]"
                    style={{
                      minWidth: "120px",
                      color: isLow ? "#C0392B" : "#888",
                    }}
                    autoFocus
                  />
                </div>
              </div>

              {/* "Pro — Coming Soon" badge: buyer sniping threshold (no interaction) */}
              <div className="flex justify-center mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F2F2F2] text-[#999] text-[10px] font-semibold tracking-[0.04em] rounded-sm select-none cursor-default"
                  title="Pro feature — coming soon"
                >
                  <Lock className="w-3 h-3" strokeWidth={2} />
                  PRO · SNIPING THRESHOLD — COMING SOON
                </span>
              </div>

              {/* ── Real-time Competitive / Low info box ── */}
              {/* Reserve consistent vertical space so the box appearing/disappearing
                  as the buyer types causes no layout shift. */}
              <div className="min-h-[88px] mb-3">
                {showAmountError ? (
                  <p className="text-[12px] text-center" style={{ color: "#C0392B" }}>
                    Please enter a valid dollar amount.
                  </p>
                ) : offerLabel ? (
                  <div
                    className="px-4 py-3 rounded-sm"
                    style={{
                      backgroundColor: isLow ? "#FBE9E7" : "#E6F4EA",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                        style={{ backgroundColor: isLow ? "#C0392B" : "#1E7D34" }}
                      />
                      <span
                        className="text-[13px] font-semibold"
                        style={{ color: isLow ? "#C0392B" : "#1E7D34" }}
                      >
                        {isLow ? "Low" : "Competitive"}
                      </span>
                    </div>
                    <p className="text-[12px] leading-snug" style={{ color: isLow ? "#8a3024" : "#2d5a2d" }}>
                      {isLow
                        ? "Offers this far below the asking price are rarely accepted on Grailed."
                        : "Your offer is within the typical accepted range for this item."}
                    </p>
                    {rangeMin != null && (
                      <p className="text-[11px] mt-1.5" style={{ color: isLow ? "#a85a4e" : "#4a8a4a" }}>
                        Typical accepted range:{" "}
                        <strong>${rangeMin.toLocaleString()}–${rangeMax.toLocaleString()}</strong>
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Static notes — always visible once a valid amount is entered */}
              {isValidOffer && (
                <>
                  <p className="text-[12px] text-[#888] text-center mb-2">
                    Shipping and taxes calculated in the next step
                  </p>
                  <p className="text-[12px] text-[#888] text-center mb-7">
                    The seller has 24 hours to accept this offer
                  </p>
                </>
              )}
              {!isValidOffer && <div className="mb-7" />}

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

        {/* ══════════════════ STEP 2 ══════════════════ */}
        {step === 2 && !submitted && (
          <>
            {/* Header */}
            <div className="relative flex items-center justify-center px-12 py-4 border-b border-[#E8E8E8]">
              <button
                onClick={() => setStep(1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A] hover:opacity-60 p-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-[15px] font-semibold text-[#1A1A1A]">Step 2 of 2: Review Offer</h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Two-column body */}
            <div className="flex flex-col lg:flex-row">

              {/* ── LEFT COLUMN ── */}
              <div className="flex-1 px-6 py-6 border-b lg:border-b-0 lg:border-r border-[#E8E8E8]">

                {/* Shipping Address */}
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] mb-3">Shipping Address</h3>
                <div className="border border-[#D4D4D4] px-4 py-3 mb-6 flex items-start justify-between cursor-pointer hover:border-[#888] transition-colors">
                  <div>
                    <p className="text-[13px] font-semibold text-[#1A1A1A] mb-0.5">{buyerName || "Add your name"}</p>
                    <p className="text-[12px] text-[#888] italic">Add a shipping address in your profile settings</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#888] rotate-180 mt-0.5 flex-shrink-0" />
                </div>

                {/* Delivery */}
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5">Delivery</h3>
                <p className="text-[11px] text-[#888] mb-3 leading-snug">
                  Delivery estimates begin once the item ships. For 3 Day and Next Day orders, we ask sellers to ship within 48 hours.
                </p>
                <div className="space-y-2 mb-6">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-3 px-3 py-2.5 border border-[#E8E8E8] cursor-pointer hover:border-[#888] transition-colors"
                      onClick={() => setDelivery(opt.id)}
                    >
                      {/* Radio */}
                      <div className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        delivery === opt.id ? "border-[#1A1A1A]" : "border-[#BBBBBB]"
                      }`}>
                        {delivery === opt.id && (
                          <div className="w-[7px] h-[7px] rounded-full bg-[#1A1A1A]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold text-[#1A1A1A]">{opt.label}</p>
                        <p className="text-[11px] text-[#888]">{opt.sub}</p>
                      </div>
                      {opt.extra > 0 && (
                        <span className="text-[12px] text-[#555] flex-shrink-0">+ ${opt.extra.toFixed(2)}</span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Payment Method */}
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] mb-3">Select Your Payment Method</h3>

                {/* Card button */}
                <div className="border-2 border-[#1A1A1A] px-4 py-2.5 flex items-center gap-2.5 mb-4 w-fit">
                  <CreditCard className="w-4 h-4 text-[#1A1A1A]" />
                  <span className="text-[13px] font-semibold text-[#1A1A1A]">Card</span>
                </div>

                {/* Card number */}
                <div className="border border-[#D4D4D4] px-4 py-3 flex items-center gap-3 mb-4">
                  <div className="w-8 h-5 bg-[#E8E8E8] rounded-sm flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Card number"
                    className="flex-1 text-[13px] text-[#888] outline-none bg-transparent placeholder:text-[#BBBBBB]"
                  />
                  <span className="text-[11px] text-[#BBBBBB] whitespace-nowrap">MM / YY&nbsp;&nbsp;CVC</span>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <Checkbox
                    checked={billingSame}
                    onChange={() => setBillingSame((v) => !v)}
                    label="Billing address same as shipping address"
                  />
                  <Checkbox
                    checked={saveCard}
                    onChange={() => setSaveCard((v) => !v)}
                    label="Save card securely for future use"
                  />
                </div>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="flex-1 px-6 py-6">

                {/* Listing card — no outer border, matches screenshot */}
                <div className="flex items-start gap-3 mb-5 pb-5 border-b border-[#E8E8E8]">
                  <div className="w-[64px] h-[64px] bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
                    {listing.image_url[0] && (
                      <img src={listing.image_url[0]} alt={listing.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#1A1A1A]">{listing.brand}</p>
                    <p className="text-[12px] text-[#1A1A1A] leading-snug">{listing.title}</p>
                    <p className="text-[11px] text-[#888] mt-0.5">Size: {listing.size}</p>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span className="text-[11px] text-[#888]">Seller:</span>
                      <span className="text-[11px] text-[#2557D6] underline cursor-pointer">{sellerName || "Seller"}</span>
                      <span className="flex items-center" style={{ lineHeight: 1 }}>
                        {(() => {
                          // Same rating as the seller's public card / dashboard.
                          const filled = listing.seller_id
                            ? Math.round(getSellerRating(listing.seller_id).rating)
                            : 5;
                          return [1, 2, 3, 4, 5].map((i) => (
                            <svg key={i} viewBox="0 0 12 12" width="10" height="10" fill={i <= filled ? "#F5A623" : "#E0E0E0"} xmlns="http://www.w3.org/2000/svg">
                              <polygon points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,10.5 6,8.5 2.7,10.5 3.5,7 1,4.8 4.5,4.5" />
                            </svg>
                          ));
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <p className="text-[13px] font-semibold text-[#1A1A1A] mb-3">Offer Details</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#555]">Offer Price</span>
                    <span className="text-[#1A1A1A]">${offerNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#555]">Shipping</span>
                    <span className="text-[#1A1A1A]">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#555] flex items-center gap-1">
                      Estimated Tax
                      <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full border border-[#888] text-[9px] text-[#888] cursor-help">i</span>
                    </span>
                    <span className="text-[#1A1A1A]">${estimatedTax.toFixed(2)}</span>
                  </div>
                </div>

                {/* OFFER TOTAL */}
                <div className="flex justify-between items-center py-3 border-t border-[#E8E8E8] mb-4">
                  <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#1A1A1A]">OFFER TOTAL</span>
                  <span className="text-[16px] font-bold text-[#1A1A1A]">${offerTotal.toFixed(2)}</span>
                </div>

                {/* TOS checkbox */}
                <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
                  <div
                    onClick={() => setTosAccepted((v) => !v)}
                    className={`mt-[2px] w-[16px] h-[16px] flex-shrink-0 border flex items-center justify-center cursor-pointer transition-colors ${
                      tosAccepted ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#888]"
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

                {/* Error */}
                {submitError && (
                  <p className="text-[12px] text-[#DC2626] mb-3 text-center">{submitError}</p>
                )}

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={!tosAccepted || submitting}
                  className={`w-full py-[13px] text-[13px] font-semibold tracking-[0.08em] transition-colors mb-6 ${
                    tosAccepted && !submitting
                      ? "bg-[#1A1A1A] text-white hover:bg-black cursor-pointer"
                      : "bg-[#E8E8E8] text-[#AAAAAA] cursor-not-allowed"
                  }`}
                >
                  {submitting ? "SUBMITTING…" : "SUBMIT OFFER"}
                </button>

                {/* Grailed Purchase Protection */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield className="w-[14px] h-[14px] text-[#1A1A1A]" />
                    <p className="text-[12px] font-semibold text-[#1A1A1A]">Grailed Purchase Protection</p>
                  </div>
                  <p className="text-[11px] text-[#555] leading-relaxed mb-2">
                    This offer is binding and expires after 24 hours. If the seller accepts this offer, your payment will be processed.{" "}
                    <a href="#" className="underline hover:opacity-70">Learn more</a>.
                  </p>
                  <p className="text-[11px] text-[#555] leading-relaxed">
                    Buy with confidence. Qualifying orders are covered by our Purchase Protection in the rare case something goes wrong.{" "}
                    <a href="#" className="underline hover:opacity-70">Learn more</a>
                  </p>
                </div>

                {/* Taxes & Tariffs */}
                <div>
                  <p className="text-[12px] font-semibold text-[#1A1A1A] mb-1.5">Taxes &amp; Tariffs</p>
                  <p className="text-[11px] text-[#555] leading-relaxed">
                    Tax is calculated based on your shipping address and applicable local rates. Tariffs may apply for international orders.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════ SUCCESS ══════════════════ */}
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
