"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { useProfiles } from "@/lib/use-profiles";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { listings, offers, updateOfferStatus, addListing, deleteListing } = useStore();
  const { getProfileById } = useProfiles();
  const [activeTab, setActiveTab] = useState<"listings" | "offers">("listings");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    brand: "",
    description: "",
    category: "Tops",
    size: "",
    condition: "Gently Used",
    price: "",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"],
  });

  if (!user) return null;

  const myListings = listings.filter((l) => l.seller_id === user.id);
  const myListingIds = myListings.map((l) => l.id);
  const myOffers = offers.filter((o) => myListingIds.includes(o.listing_id));

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    await addListing({
      seller_id: user.id,
      title: form.title,
      brand: form.brand,
      description: form.description,
      category: form.category,
      size: form.size,
      condition: form.condition,
      price: parseFloat(form.price),
      images: form.images,
    });
    setForm({ title: "", brand: "", description: "", category: "Tops", size: "", condition: "Gently Used", price: "", images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"] });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Seller Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2 text-xs font-bold tracking-wide border transition-colors ${
              activeTab === "listings" ? "bg-[#1A1A1A] text-white" : "border-[#1A1A1A] hover:bg-gray-50"
            }`}
          >
            MY LISTINGS
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-4 py-2 text-xs font-bold tracking-wide border transition-colors ${
              activeTab === "offers" ? "bg-[#1A1A1A] text-white" : "border-[#1A1A1A] hover:bg-gray-50"
            }`}
          >
            OFFERS ({myOffers.filter((o) => o.status === "pending").length})
          </button>
        </div>
      </div>

      {activeTab === "listings" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black transition-colors"
            >
              <Plus className="w-4 h-4" />
              {showForm ? "CANCEL" : "NEW LISTING"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreateListing} className="bg-white border border-[#E8E8E8] p-6 mb-6">
              <h2 className="text-sm font-bold mb-4">Create New Listing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Brand</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Price</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Size</label>
                  <input
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm outline-none bg-white"
                  >
                    <option>Tops</option>
                    <option>Bottoms</option>
                    <option>Outerwear</option>
                    <option>Footwear</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Condition</label>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm outline-none bg-white"
                  >
                    <option>New/Never Worn</option>
                    <option>Gently Used</option>
                    <option>Used</option>
                    <option>Very Worn</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm outline-none h-20 resize-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Image URL</label>
                  <input
                    value={form.images[0]}
                    onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black transition-colors"
              >
                CREATE LISTING
              </button>
            </form>
          )}

          {/* Listings Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {myListings.map((listing) => (
              <div key={listing.id} className="bg-white border border-[#E8E8E8] overflow-hidden">
                <Link href={`/listing/${listing.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </Link>
                <div className="p-3">
                  <p className="text-xs font-medium truncate">{listing.title}</p>
                  <p className="text-sm font-bold">${listing.price.toLocaleString()}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] text-red-600 border border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "offers" && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide">Incoming Offers</h2>
          {myOffers.length === 0 ? (
            <p className="text-sm text-gray-500">No offers yet.</p>
          ) : (
            <div className="bg-white border border-[#E8E8E8]">
              {myOffers.map((offer) => {
                const listing = listings.find((l) => l.id === offer.listing_id);
                const buyer = getProfileById(offer.buyer_id);
                const competitive = listing ? offer.amount >= listing.price * 0.85 : false;

                return (
                  <div
                    key={offer.id}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-[#F0F0F0] last:border-0 ${
                      offer.status === "declined" ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {listing && (
                        <img src={listing.images[0]} alt="" className="w-12 h-12 object-cover" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{listing?.title}</p>
                        <p className="text-xs text-gray-500">
                          From: {buyer?.name} · Listed: ${listing?.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold">${offer.amount.toLocaleString()}</p>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-sm ${
                            competitive ? "bg-green-100 text-[#16A34A]" : "bg-red-100 text-[#DC2626]"
                          }`}
                        >
                          {competitive ? "Competitive" : "Low"}
                        </span>
                      </div>
                      {offer.status === "pending" ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateOfferStatus(offer.id, "accepted")}
                            className="p-2 bg-green-50 hover:bg-green-100 rounded transition-colors"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => updateOfferStatus(offer.id, "declined")}
                            className="p-2 bg-red-50 hover:bg-red-100 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 text-xs font-medium ${
                            offer.status === "accepted" ? "text-green-600" : "text-gray-500"
                          }`}
                        >
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
      )}
    </div>
  );
}
