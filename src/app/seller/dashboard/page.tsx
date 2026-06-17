"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { useProfiles } from "@/lib/use-profiles";
import {
  Plus, Trash2, X, TrendingDown, Zap, Tag, Menu, MapPin, Eye, Lock,
} from "lucide-react";
import { createPortal } from "react-dom";
import StarRating from "@/components/ui/StarRating";
import { getOfferLabel, getSellerRating } from "@/lib/data";

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

              {/* Stars — shared component, consistent with the public seller card */}
              <div className="mb-2">
                <StarRating size={12} {...getSellerRating(user.id)} />
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6">
                    {myListings.map((listing) => {
                      const offerCount = myOffers.filter(
                        (o) => o.listing_id === listing.id && o.status === "pending"
                      ).length;
                      const hasSale = listing.sale_price && listing.sale_price < listing.listed_price;
                      const discountPct = hasSale
                        ? Math.round((1 - listing.sale_price! / listing.listed_price) * 100)
                        : null;
                      const timeAgo = (() => {
                        const diff = Date.now() - new Date(listing.created_at).getTime();
                        const days = Math.floor(diff / 86400000);
                        if (days === 0) return "Today";
                        if (days === 1) return "1 day ago";
                        return `${days} days ago`;
                      })();
                      return (
                        <div key={listing.id} className="flex flex-col">
                          {/* Timestamp */}
                          <p className="text-[10px] text-[#888] mb-1">{timeAgo}</p>

                          {/* Thumbnail */}
                          <Link href={`/listing/${listing.id}`} className="block relative mb-1.5">
                            <div className="aspect-[3/4] bg-[#F2F2F2] overflow-hidden">
                              <img
                                src={listing.image_url?.[0] || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"}
                                alt={listing.title}
                                className="w-full h-full object-contain hover:opacity-90 transition-opacity"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }}
                              />
                            </div>
                            {offerCount > 0 && (
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#E85D00] text-white text-[9px] font-bold tracking-[0.06em]">
                                {offerCount} OFFER{offerCount > 1 ? "S" : ""}
                              </span>
                            )}
                          </Link>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between gap-1 mb-0.5">
                              <p className="text-[12px] font-semibold text-[#1A1A1A] truncate">{listing.brand}</p>
                              <p className="text-[11px] text-[#888] flex-shrink-0">{listing.size}</p>
                            </div>
                            <Link href={`/listing/${listing.id}`}>
                              <p className="text-[11px] text-[#555] truncate hover:underline mb-1">{listing.title}</p>
                            </Link>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {hasSale ? (
                                  <>
                                    <span className="text-[12px] font-bold text-[#1A1A1A]">${listing.sale_price!.toLocaleString()}</span>
                                    <span className="text-[11px] text-[#888] line-through">${listing.listed_price.toLocaleString()}</span>
                                    <span className="text-[10px] text-[#888]">{discountPct}% off</span>
                                  </>
                                ) : (
                                  <span className="text-[12px] font-bold text-[#1A1A1A]">${listing.listed_price.toLocaleString()}</span>
                                )}
                              </div>
                              {(listing.watchers_count ?? 0) > 0 && (
                                <span className="text-[11px] text-[#888] flex-shrink-0">{listing.watchers_count}♡</span>
                              )}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="grid grid-cols-3 border border-[#E8E8E8] mt-2">
                            <button
                              onClick={() => alert("Price Drop — Demo")}
                              className="py-2 text-[9px] font-bold tracking-[0.04em] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors border-r border-[#E8E8E8]"
                            >
                              PRICE DROP
                            </button>
                            <button
                              onClick={() => alert("Bump — Demo")}
                              className="py-2 text-[9px] font-bold tracking-[0.04em] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors border-r border-[#E8E8E8]"
                            >
                              BUMP
                            </button>
                            <button
                              onClick={() => alert("Send Offer — Demo")}
                              className="py-2 text-[9px] font-bold tracking-[0.04em] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                            >
                              SEND OFFER
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

                {/* ── RECEIVED offers (seller view) — grouped by item ── */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <h2 className="text-[15px] font-bold text-[#1A1A1A]">Offers</h2>
                    {/* "Pro — Coming Soon" badge: seller auto-responder (no interaction) */}
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F2F2F2] text-[#999] text-[10px] font-semibold tracking-[0.04em] rounded-sm select-none cursor-default"
                      title="Pro feature — coming soon"
                    >
                      <Lock className="w-3 h-3" strokeWidth={2} />
                      PRO · AUTO-RESPONDER — COMING SOON
                    </span>
                  </div>

                  {myOffers.length === 0 ? (
                    <div className="py-16 text-center">
                      <p className="text-[13px] text-[#888]">No offers pending</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {myListings
                        .map((listing) => ({
                          listing,
                          items: myOffers.filter((o) => o.listing_id === listing.id),
                        }))
                        .filter((g) => g.items.length > 0)
                        .map(({ listing, items }) => {
                          const watchers = listing.watchers_count ?? 0;
                          const rMin = listing.competitive_range_min ?? null;
                          const rMax = listing.competitive_range_max ?? listing.listed_price;
                          const single = items.length === 1;
                          return (
                            <div key={listing.id} style={{ maxWidth: single ? 340 : 680 }}>
                              {/* Item group title */}
                              <p className="text-[14px] font-semibold text-[#555] mb-2.5">
                                {listing.title}{" "}
                                <span className="text-[#999] font-normal">
                                  · Listed at ${listing.listed_price.toLocaleString()}
                                </span>
                              </p>

                              {/* Watcher nudge card — spans the item's offer row */}
                              {(watchers > 0 || rMin != null) && (
                                <div className="flex items-center gap-2 bg-[#F0F7F0] border-l-[3px] border-[#4A8A4A] rounded-sm px-3.5 py-2.5 mb-2.5">
                                  <Eye className="w-4 h-4 text-[#2D5A2D] flex-shrink-0" strokeWidth={1.8} />
                                  <p className="text-[12px] text-[#2D5A2D] leading-snug">
                                    {watchers > 0 ? (
                                      <>
                                        <strong>{watchers} buyer{watchers > 1 ? "s" : ""}</strong>{" "}
                                        {watchers > 1 ? "are" : "is"} watching this item
                                      </>
                                    ) : (
                                      <>This item is live</>
                                    )}
                                    {rMin != null && (
                                      <>
                                        {" "}· Consider an offer between{" "}
                                        <strong>${rMin.toLocaleString()}–${rMax.toLocaleString()}</strong>
                                      </>
                                    )}
                                  </p>
                                </div>
                              )}

                              {/* Offer cards */}
                              <div className={`grid gap-3 ${single ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                                {items.map((offer) => {
                                  const buyer = getProfileById(offer.buyer_id);
                                  const thumb = listing.image_url?.[0] || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60";
                                  // Same logic as buyer-side: no tag when the item
                                  // has no competitive_range_min seeded.
                                  const label = getOfferLabel(offer.amount, listing.competitive_range_min);
                                  return (
                                    <div
                                      key={offer.id}
                                      className={`bg-white border border-[#E5E5E5] rounded-sm overflow-hidden ${
                                        offer.status !== "pending" ? "opacity-60" : ""
                                      }`}
                                    >
                                      {/* Thumbnail */}
                                      <Link href={`/listing/${listing.id}`}>
                                        <div className="h-[140px] bg-[#F2F2F2] overflow-hidden">
                                          <img
                                            src={thumb}
                                            alt={listing.title}
                                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }}
                                          />
                                        </div>
                                      </Link>

                                      <div className="p-3">
                                        {/* Top row: buyer + Competitive/Low tag */}
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                          <span className="text-[12px] text-[#333] truncate">
                                            From: <strong>{buyer?.name || "Buyer"}</strong>
                                          </span>
                                          {label && (
                                            <span
                                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                                label === "competitive"
                                                  ? "bg-[#E6F4EA] text-[#1E7D34]"
                                                  : "bg-[#FBE9E7] text-[#C0392B]"
                                              }`}
                                            >
                                              {label === "competitive" ? "Competitive" : "Low"}
                                            </span>
                                          )}
                                        </div>

                                        {/* Amount */}
                                        <p className="text-[16px] font-bold text-[#111] mb-2.5">
                                          ${offer.amount.toLocaleString()}
                                        </p>

                                        {/* Actions */}
                                        {offer.status === "pending" ? (
                                          <>
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => setAcceptingOffer(offer)}
                                                className="flex-1 py-[7px] bg-[#111] text-white text-[12px] font-semibold rounded-sm hover:bg-black transition-colors"
                                              >
                                                Accept
                                              </button>
                                              <button
                                                onClick={() => updateOfferStatus(offer.id, "declined")}
                                                className="flex-1 py-[7px] border border-[#DDD] text-[#999] text-[12px] rounded-sm hover:border-[#999] hover:text-[#1A1A1A] transition-colors"
                                              >
                                                Decline
                                              </button>
                                            </div>
                                            <button
                                              onClick={() => {/* non-functional for demo */}}
                                              className="mt-2 w-full text-[11px] text-[#2557D6] hover:underline transition-colors"
                                            >
                                              Message buyer
                                            </button>
                                          </>
                                        ) : (
                                          <span
                                            className={`inline-block text-[11px] font-medium px-3 py-1.5 rounded-sm ${
                                              offer.status === "accepted"
                                                ? "text-green-600 bg-green-50"
                                                : "text-[#888] bg-[#F7F7F7]"
                                            }`}
                                          >
                                            {offer.status === "accepted" ? "Accepted ✓" : "Passed"}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
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
