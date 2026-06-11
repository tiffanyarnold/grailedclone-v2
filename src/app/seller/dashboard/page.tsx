"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { useProfiles } from "@/lib/use-profiles";
import {
  Plus, Trash2, Check, X, TrendingDown, Zap, Tag, Menu, MapPin, Star,
} from "lucide-react";
import { createPortal } from "react-dom";

// ── Accept Offer Confirmation Modal ───────────────────────────────────────────
function AcceptOfferModal({
  offer,
  listing,
  buyerName,
  onConfirm,
  onClose,
}: {
  offer: { id: string; amount: number; status: string };
  listing: { title: string; brand: string; image_url: string[]; listed_price: number } | undefined;
  buyerName: string | undefined;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const thumb = listing?.image_url?.[0] || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60";

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-[420px] shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
          <h2 className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#1A1A1A]">
            Accept Offer
          </h2>
          <button onClick={onClose} className="text-[#888] hover:text-[#1A1A1A] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">

          {/* Listing preview */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
              <img
                src={thumb}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#888]">{listing?.brand || ""}</p>
              <p className="text-[13px] font-semibold text-[#1A1A1A] truncate leading-snug">
                {listing?.title || "Listing"}
              </p>
              <p className="text-[11px] text-[#888] mt-0.5">
                Listed at ${listing?.listed_price.toLocaleString() || "—"}
              </p>
            </div>
          </div>

          {/* Offer details */}
          <div className="bg-[#F7F7F7] px-4 py-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">Buyer</span>
              <span className="text-[12px] text-[#1A1A1A]">{buyerName || "Buyer"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">Offer Amount</span>
              <span className="text-[15px] font-bold text-[#1A1A1A]">${offer.amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Notice */}
          <p className="text-[11px] text-[#888] leading-relaxed">
            By accepting this offer, you agree to sell the item to this buyer at the offered price.
            The buyer will be notified and directed to complete payment.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#D4D4D4] text-[11px] font-bold tracking-[0.1em] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="flex-1 py-3 bg-[#1A1A1A] text-white text-[11px] font-bold tracking-[0.1em] hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirming ? "ACCEPTING…" : "ACCEPT OFFER"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Sidebar nav structure ──────────────────────────────────────────────────
const NAV = [
  { label: "MESSAGES", href: "/messages" },
  { label: "ORDERS", href: "/seller/dashboard?tab=orders" },
  {
    label: "SELLING",
    children: [
      { label: "FOR SALE", tab: "forsale" },
      { label: "OFFERS", tab: "offers" },
      { label: "SOLD", tab: "sold" },
      { label: "DRAFTS", tab: "drafts" },
    ],
  },
  {
    label: "SETTINGS",
    children: [
      { label: "PROFILE", href: "/profile" },
      { label: "FEEDBACK", href: "/feedback" },
      { label: "ACCOUNT HEALTH", href: "/account-health" },
      { label: "VACATION MODE", href: "/vacation-mode" },
      { label: "SHIPPING LABELS", href: "/shipping-labels" },
      { label: "MY SIZES", href: "/my-sizes" },
      { label: "ADDRESSES", href: "/addresses" },
      { label: "PAYMENTS", href: "/payments" },
      { label: "NOTIFICATIONS", href: "/notifications" },
      { label: "DEVICES", href: "/devices" },
      { label: "HELP", href: "/help" },
    ],
  },
];

// ── Sidebar component ──────────────────────────────────────────────────────
function Sidebar({
  activeTab,
  onTabChange,
  onClose,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}) {
  return (
    <nav
      className="w-full h-full"
      style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
    >
      {NAV.map((item) => {
        if (!item.children) {
          return (
            <Link
              key={item.label}
              href={item.href!}
              onClick={onClose}
              className="block py-[6px] text-[11px] font-normal tracking-[0.06em] text-[#999] hover:text-[#1A1A1A] transition-colors"
            >
              {item.label}
            </Link>
          );
        }

        // Section header (SELLING / SETTINGS) — plain label, no toggle
        return (
          <div key={item.label} className="mt-5 mb-1">
            {/* Section label */}
            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#BBBBBB] uppercase mb-1">
              {item.label}
            </p>
            <div>
              {item.children.map((child) => {
                if ("tab" in child) {
                  const isActive = activeTab === child.tab;
                  return (
                    <button
                      key={child.label}
                      onClick={() => { onTabChange(child.tab!); onClose?.(); }}
                      className={`block w-full text-left py-[6px] text-[11px] tracking-[0.06em] transition-colors ${
                        isActive
                          ? "font-semibold text-[#1A1A1A] border-b border-[#1A1A1A] w-fit"
                          : "font-normal text-[#999] hover:text-[#1A1A1A]"
                      }`}
                    >
                      {child.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={child.label}
                    href={child.href!}
                    onClick={onClose}
                    className="block py-[6px] text-[11px] font-normal tracking-[0.06em] text-[#999] hover:text-[#1A1A1A] transition-colors"
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

function SellerDashboardInner() {
  const { user } = useAuth();
  const { listings, offers, updateOfferStatus, deleteListing } = useStore();
  const { getProfileById } = useProfiles();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") || "forsale";
  const validTabs = ["forsale", "offers", "sold", "drafts"];
  const [activeTab, setActiveTab] = useState(validTabs.includes(tabParam) ? tabParam : "forsale");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Accept offer popup state
  const [acceptingOffer, setAcceptingOffer] = useState<{
    id: string; amount: number; status: string; listing_id: string; buyer_id: string;
  } | null>(null);

  useEffect(() => {
    const t = searchParams.get("tab") || "forsale";
    if (validTabs.includes(t)) setActiveTab(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!user) return null;

  const sellerProfile = getProfileById(user.id);
  const initials = (user.name || user.email || "U").slice(0, 2).toUpperCase();
  const username = user.name
    ? user.name.toLowerCase().replace(/\s+/g, "") + (user.id?.slice(-4) || "")
    : user.email?.split("@")[0] || "user";

  const myListings = listings.filter((l) => l.seller_id === user.id);
  const myListingIds = myListings.map((l) => l.id);
  const myOffers = offers.filter((o) => myListingIds.includes(o.listing_id));
  const sentOffers = offers.filter((o) => o.buyer_id === user.id);

  const handleAcceptConfirm = async () => {
    if (!acceptingOffer) return;
    await updateOfferStatus(acceptingOffer.id, "accepted");
    setAcceptingOffer(null);
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* ── Seller Profile Header ── */}
        <div className="py-8 border-b border-[#E8E8E8] mb-0">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">

            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-[90px] h-[90px] rounded-full bg-[#2A2A2A] flex flex-col items-center justify-center">
                <span className="text-[22px] font-bold text-white leading-none">{initials}</span>
                <span className="text-[9px] text-[#AAA] mt-1 tracking-wide">Add Photo</span>
              </div>
            </div>

            {/* Profile info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[18px] font-bold text-[#1A1A1A] leading-tight mb-0.5">{username}</h1>
              <p className="text-[12px] text-[#888] mb-2">
                {sellerProfile?.transaction_count ?? 0} Transactions · Joined in {new Date().getFullYear()}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-2">
                <span className="text-[12px] text-[#888]">0.0</span>
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-3 h-3 text-[#CCCCCC]" strokeWidth={1.5} />
                ))}
                <span className="text-[11px] text-[#888] ml-1">No Reviews</span>
              </div>

              {/* Following / Followers / Location */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#888]">
                <span><strong className="text-[#1A1A1A]">0</strong> Following</span>
                <span><strong className="text-[#1A1A1A]">1</strong> Follower</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  United States
                </span>
              </div>
            </div>

            {/* NEW LISTING button — top right */}
            <div className="flex-shrink-0 sm:self-start">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-bold tracking-[0.1em] hover:bg-black transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                NEW LISTING
              </Link>
            </div>
          </div>
        </div>

        {/* ── Layout: Sidebar + Content ── */}
        <div className="flex min-h-[calc(100vh-280px)]">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-[180px] flex-shrink-0 border-r border-[#E8E8E8] py-6 pr-6">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </aside>

          {/* ── Mobile sidebar overlay ── */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-[260px] bg-white px-5 overflow-y-auto">
                <div className="flex items-center justify-between py-4 border-b border-[#E8E8E8] mb-2">
                  <span className="text-[13px] font-bold tracking-[0.08em]">DASHBOARD</span>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="w-5 h-5 text-[#888]" />
                  </button>
                </div>
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onClose={() => setMobileSidebarOpen(false)} />
              </div>
            </div>
          )}

          {/* ── Main Content ── */}
          <main className="flex-1 py-6 px-0 sm:px-8 min-w-0">

            {/* Mobile top bar */}
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 border border-[#E8E8E8] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
              <span className="text-[13px] font-bold tracking-[0.08em] uppercase">
                {activeTab === "forsale" ? "For Sale" :
                 activeTab === "offers" ? "Offers" :
                 activeTab === "sold" ? "Sold" : "Drafts"}
              </span>
            </div>

            {/* ── FOR SALE tab ── */}
            {activeTab === "forsale" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h2 className="text-[15px] font-bold text-[#1A1A1A]">
                    For Sale ({myListings.length})
                  </h2>
                </div>

                {myListings.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-[#D4D4D4]">
                    <p className="text-[13px] text-[#888] mb-4">You don&apos;t have any listings yet.</p>
                    <Link
                      href="/sell"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white text-[11px] font-bold tracking-[0.1em] hover:bg-black transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      CREATE YOUR FIRST LISTING
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myListings.map((listing) => {
                      const offerCount = myOffers.filter(
                        (o) => o.listing_id === listing.id && o.status === "pending"
                      ).length;
                      return (
                        <div
                          key={listing.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-[#E8E8E8] p-4 hover:border-[#C8C8C8] transition-colors"
                        >
                          {/* Thumbnail */}
                          <Link href={`/listing/${listing.id}`} className="flex-shrink-0">
                            <div className="w-[72px] h-[72px] bg-[#F2F2F2] overflow-hidden">
                              <img
                                src={listing.image_url?.[0] || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"}
                                alt={listing.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }}
                              />
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.1em] text-[#888] mb-0.5">
                              {listing.brand}
                            </p>
                            <Link href={`/listing/${listing.id}`}>
                              <p className="text-[13px] font-semibold text-[#1A1A1A] truncate hover:underline">
                                {listing.title}
                              </p>
                            </Link>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <span className="text-[13px] font-bold text-[#1A1A1A]">
                                ${listing.listed_price.toLocaleString()}
                              </span>
                              <span className="text-[11px] text-[#888]">
                                Size {listing.size} · {listing.condition}
                              </span>
                              {offerCount > 0 && (
                                <span className="px-2 py-0.5 bg-[#FFF0E8] text-[#E85D00] text-[10px] font-bold tracking-[0.06em]">
                                  {offerCount} OFFER{offerCount > 1 ? "S" : ""}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => alert("Price Drop — Demo")}
                              className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold tracking-[0.08em] border border-[#D4D4D4] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors whitespace-nowrap"
                            >
                              <TrendingDown className="w-3 h-3" />
                              PRICE DROP
                            </button>
                            <button
                              onClick={() => alert("Bump — Demo")}
                              className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold tracking-[0.08em] border border-[#D4D4D4] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                            >
                              <Zap className="w-3 h-3" />
                              BUMP
                            </button>
                            <button
                              onClick={() => alert("Send Offer — Demo")}
                              className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold tracking-[0.08em] border border-[#D4D4D4] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors whitespace-nowrap"
                            >
                              <Tag className="w-3 h-3" />
                              SEND OFFER
                            </button>
                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="p-2 text-[#DC2626] border border-[#FECACA] hover:bg-red-50 transition-colors"
                              title="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── OFFERS tab ── */}
            {activeTab === "offers" && (
              <div className="space-y-10">

                {/* ── RECEIVED offers (seller view) ── */}
                <div>
                  <h2 className="text-[15px] font-bold text-[#1A1A1A] mb-5">
                    Offers
                  </h2>

                  {myOffers.length === 0 ? (
                    <div className="py-16 text-center">
                      <p className="text-[13px] text-[#888]">No offers pending</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myOffers.map((offer) => {
                        const listing = listings.find((l) => l.id === offer.listing_id);
                        const buyer = getProfileById(offer.buyer_id);
                        const competitive = listing ? offer.amount >= listing.listed_price * 0.85 : false;
                        const thumb = listing?.image_url?.[0] || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60";
                        return (
                          <div
                            key={offer.id}
                            className={`flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-[#E8E8E8] p-4 ${
                              offer.status === "declined" ? "opacity-50" : ""
                            }`}
                          >
                            <div className="w-[64px] h-[64px] bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
                              <img src={thumb} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{listing?.title || "Listing removed"}</p>
                              <p className="text-[11px] text-[#888] mt-0.5">
                                From: {buyer?.name || "Buyer"} · {listing ? `Listed at $${listing.listed_price.toLocaleString()}` : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-right">
                                <p className="text-[14px] font-bold text-[#1A1A1A]">${offer.amount.toLocaleString()}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 ${
                                  competitive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                }`}>
                                  {competitive ? "COMPETITIVE" : "LOW"}
                                </span>
                              </div>
                              {offer.status === "pending" ? (
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => setAcceptingOffer(offer)}
                                    className="p-2 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors"
                                    title="Accept"
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                  </button>
                                  <button
                                    onClick={() => updateOfferStatus(offer.id, "declined")}
                                    className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                                    title="Decline"
                                  >
                                    <X className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              ) : (
                                <span className={`text-[11px] font-medium px-3 py-1.5 ${
                                  offer.status === "accepted" ? "text-green-600 bg-green-50" : "text-[#888] bg-[#F7F7F7]"
                                }`}>
                                  {offer.status === "accepted" ? "Accepted ✓" : "Declined"}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── SENT offers (buyer view) ── */}
                {sentOffers.length > 0 && (
                  <div>
                    <h2 className="text-[15px] font-bold text-[#1A1A1A] mb-1">
                      Offers Sent
                    </h2>
                    <p className="text-[11px] text-[#888] mb-5">Offers you&apos;ve made on other listings</p>
                    <div className="space-y-3">
                      {sentOffers.map((offer) => {
                        const listing = listings.find((l) => l.id === offer.listing_id);
                        const thumb = listing?.image_url?.[0] || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60";
                        return (
                          <div
                            key={offer.id}
                            className={`flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-[#E8E8E8] p-4 ${
                              offer.status === "declined" ? "opacity-50" : ""
                            }`}
                          >
                            {listing ? (
                              <Link href={`/listing/${listing.id}`} className="flex-shrink-0">
                                <div className="w-[64px] h-[64px] bg-[#F2F2F2] overflow-hidden hover:opacity-80 transition-opacity">
                                  <img src={thumb} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }} />
                                </div>
                              </Link>
                            ) : (
                              <div className="w-[64px] h-[64px] bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
                                <img src={thumb} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{listing?.title || "Listing removed"}</p>
                              <p className="text-[11px] text-[#888] mt-0.5">
                                {listing ? `${listing.brand} · Listed at $${listing.listed_price.toLocaleString()}` : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-right">
                                <p className="text-[14px] font-bold text-[#1A1A1A]">${offer.amount.toLocaleString()}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 ${
                                  offer.status === "pending"
                                    ? "bg-[#FFF0E8] text-[#E85D00]"
                                    : offer.status === "accepted"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-[#F7F7F7] text-[#888]"
                                }`}>
                                  {offer.status === "pending" ? "PENDING" : offer.status === "accepted" ? "ACCEPTED ✓" : "DECLINED"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ── SOLD tab ── */}
            {activeTab === "sold" && (
              <div>
                <h2 className="text-[15px] font-bold text-[#1A1A1A] mb-6">Sold</h2>
                <div className="text-center py-20 border border-dashed border-[#D4D4D4]">
                  <p className="text-[13px] text-[#888]">Items you&apos;ve sold will appear here.</p>
                </div>
              </div>
            )}

            {/* ── DRAFTS tab ── */}
            {activeTab === "drafts" && (
              <div>
                <h2 className="text-[15px] font-bold text-[#1A1A1A] mb-6">Drafts</h2>
                <div className="text-center py-20 border border-dashed border-[#D4D4D4]">
                  <p className="text-[13px] text-[#888] mb-4">
                    Listings saved as drafts will appear here.
                  </p>
                  <Link
                    href="/sell"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1A1A1A] text-[11px] font-bold tracking-[0.1em] hover:bg-[#F7F7F7] transition-colors"
                  >
                    START A LISTING
                  </Link>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ── Accept Offer Modal ── */}
      {acceptingOffer && (
        <AcceptOfferModal
          offer={acceptingOffer}
          listing={listings.find((l) => l.id === acceptingOffer.listing_id)}
          buyerName={getProfileById(acceptingOffer.buyer_id)?.name}
          onConfirm={handleAcceptConfirm}
          onClose={() => setAcceptingOffer(null)}
        />
      )}
    </div>
  );
}

export default function SellerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SellerDashboardInner />
    </Suspense>
  );
}
