"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { useProfiles } from "@/lib/use-profiles";
import {
  Plus, Trash2, Check, X, TrendingDown, Zap, Tag, ChevronDown, Menu, Megaphone,
} from "lucide-react";

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
  const [sellingOpen, setSellingOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <nav
      className="w-full h-full py-6 pr-4"
      style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
    >
      {NAV.map((item) => {
        if (!item.children) {
          const isActive = item.label === "MESSAGES"
            ? false
            : item.href?.includes(`tab=${activeTab}`);
          return (
            <Link
              key={item.label}
              href={item.href!}
              onClick={onClose}
              className={`block py-[7px] text-[11px] font-bold tracking-[0.1em] transition-colors ${
                isActive
                  ? "text-[#1A1A1A] border-b border-[#1A1A1A] w-fit"
                  : "text-[#888] hover:text-[#1A1A1A]"
              }`}
            >
              {item.label}
            </Link>
          );
        }

        const isGroup = item.label === "SELLING";
        const open = isGroup ? sellingOpen : settingsOpen;
        const toggle = isGroup
          ? () => setSellingOpen((v) => !v)
          : () => setSettingsOpen((v) => !v);

        return (
          <div key={item.label} className="mt-5">
            <button
              onClick={toggle}
              className="flex items-center justify-between w-full text-[10px] font-bold tracking-[0.14em] text-[#888] mb-1 uppercase hover:text-[#1A1A1A] transition-colors"
            >
              {item.label}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div className="ml-0">
                {item.children.map((child) => {
                  if ("tab" in child) {
                    const isActive = activeTab === child.tab;
                    return (
                      <button
                        key={child.label}
                        onClick={() => { onTabChange(child.tab!); onClose?.(); }}
                        className={`block w-full text-left py-[7px] text-[11px] font-bold tracking-[0.1em] transition-colors ${
                          isActive
                            ? "text-[#1A1A1A] border-b border-[#1A1A1A] w-fit"
                            : "text-[#888] hover:text-[#1A1A1A]"
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
                      className="block py-[7px] text-[11px] font-bold tracking-[0.1em] text-[#888] hover:text-[#1A1A1A] transition-colors"
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { listings, offers, updateOfferStatus, deleteListing } = useStore();
  const { getProfileById } = useProfiles();

  const [activeTab, setActiveTab] = useState("forsale");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!user) return null;

  const myListings = listings.filter((l) => l.seller_id === user.id);
  const myListingIds = myListings.map((l) => l.id);
  // Offers RECEIVED as a seller (on my listings)
  const myOffers = offers.filter((o) => myListingIds.includes(o.listing_id));
  const pendingOffers = myOffers.filter((o) => o.status === "pending");
  // Offers SENT as a buyer (by me on other people's listings)
  const sentOffers = offers.filter((o) => o.buyer_id === user.id);

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto flex min-h-[calc(100vh-120px)]">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0 border-r border-[#E8E8E8] py-6 pr-6">
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
        <main className="flex-1 py-6 px-4 sm:px-8 min-w-0">

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

          {/* ── Announcements Banner ── */}
          <div className="bg-[#F7F7F7] border border-[#E8E8E8] px-5 py-4 mb-8">
            <div className="flex items-start gap-3">
              <Megaphone className="w-4 h-4 text-[#888] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A] mb-1">
                  Seller Announcements
                </p>
                <p className="text-[12px] text-[#888] leading-relaxed">
                  Smart Pricing is now available — automatically drop your price 10% weekly until it hits your floor price.{" "}
                  <a href="/sell" className="underline text-[#1A1A1A] hover:opacity-70">
                    Try it on your next listing →
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* ── FOR SALE tab ── */}
          {activeTab === "forsale" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A]">
                  For Sale ({myListings.length})
                </h2>
                <Link
                  href="/sell"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-bold tracking-[0.1em] hover:bg-black transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  NEW LISTING
                </Link>
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
                              src={listing.image_url[0]}
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
                <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A] mb-1">
                  Offers Received ({pendingOffers.length} pending)
                </h2>
                <p className="text-[11px] text-[#888] mb-5">Offers buyers have made on your listings</p>
                {myOffers.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[#D4D4D4]">
                    <p className="text-[13px] text-[#888]">No offers received yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myOffers.map((offer) => {
                      const listing = listings.find((l) => l.id === offer.listing_id);
                      const buyer = getProfileById(offer.buyer_id);
                      const competitive = listing ? offer.amount >= listing.listed_price * 0.85 : false;
                      return (
                        <div
                          key={offer.id}
                          className={`flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-[#E8E8E8] p-4 ${
                            offer.status === "declined" ? "opacity-50" : ""
                          }`}
                        >
                          {listing && (
                            <div className="w-[64px] h-[64px] bg-[#F2F2F2] flex-shrink-0 overflow-hidden">
                              <img src={listing.image_url[0]} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{listing?.title}</p>
                            <p className="text-[11px] text-[#888] mt-0.5">
                              From: {buyer?.name || "Buyer"} · Listed at ${listing?.listed_price.toLocaleString()}
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
                                  onClick={() => updateOfferStatus(offer.id, "accepted")}
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
              <div>
                <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A] mb-1">
                  Offers Sent ({sentOffers.filter((o) => o.status === "pending").length} pending)
                </h2>
                <p className="text-[11px] text-[#888] mb-5">Offers you&apos;ve made on other listings</p>
                {sentOffers.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[#D4D4D4]">
                    <p className="text-[13px] text-[#888]">You haven&apos;t made any offers yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sentOffers.map((offer) => {
                      const listing = listings.find((l) => l.id === offer.listing_id);
                      return (
                        <div
                          key={offer.id}
                          className={`flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-[#E8E8E8] p-4 ${
                            offer.status === "declined" ? "opacity-50" : ""
                          }`}
                        >
                          {listing && (
                            <Link href={`/listing/${listing.id}`} className="flex-shrink-0">
                              <div className="w-[64px] h-[64px] bg-[#F2F2F2] overflow-hidden hover:opacity-80 transition-opacity">
                                <img src={listing.image_url[0]} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=60"; }} />
                              </div>
                            </Link>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{listing?.title}</p>
                            <p className="text-[11px] text-[#888] mt-0.5">
                              {listing?.brand} · Listed at ${listing?.listed_price.toLocaleString()}
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
                )}
              </div>

            </div>
          )}

          {/* ── SOLD tab ── */}
          {activeTab === "sold" && (
            <div>
              <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A] mb-6">Sold</h2>
              <div className="text-center py-20 border border-dashed border-[#D4D4D4]">
                <p className="text-[13px] text-[#888]">Items you&apos;ve sold will appear here.</p>
              </div>
            </div>
          )}

          {/* ── DRAFTS tab ── */}
          {activeTab === "drafts" && (
            <div>
              <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A] mb-6">Drafts</h2>
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
  );
}
