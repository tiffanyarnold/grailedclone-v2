"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import { useProfiles } from "@/lib/use-profiles";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminListingsPage() {
  const { listings, addListing, updateListing, deleteListing } = useStore();
  const { profiles, getProfileById } = useProfiles();
  const sellers = profiles.filter((p) => p.role === "seller");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    brand: "",
    description: "",
    category: "Tops",
    size: "",
    condition: "Gently Used",
    price: "",
    seller_id: "",
    image_url: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"],
  });

  const resetForm = () => {
    setForm({
      title: "", brand: "", description: "", category: "Tops", size: "",
      condition: "Gently Used", price: "", seller_id: sellers[0]?.id || "",
      image_url: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"],
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { price, ...rest } = form;
    const payload = { ...rest, listed_price: parseFloat(price) };
    if (editId) {
      await updateListing(editId, payload);
    } else {
      await addListing(payload);
    }
    resetForm();
  };

  const handleEdit = (listing: any) => {
    setForm({
      title: listing.title,
      brand: listing.brand,
      description: listing.description,
      category: listing.category,
      size: listing.size,
      condition: listing.condition,
      price: listing.listed_price.toString(),
      seller_id: listing.seller_id,
      image_url: listing.image_url,
    });
    setEditId(listing.id);
    setShowForm(true);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Listings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "CANCEL" : "CREATE LISTING"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E8E8E8] p-6 mb-6">
          <h2 className="text-sm font-bold mb-4">{editId ? "Edit Listing" : "New Listing"}</h2>
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
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Seller</label>
              <select
                value={form.seller_id}
                onChange={(e) => setForm({ ...form, seller_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none bg-white"
                required
              >
                <option value="">Select seller...</option>
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
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
                value={form.image_url[0]}
                onChange={(e) => setForm({ ...form, image_url: [e.target.value] })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
              />
              {form.image_url[0] && (
                <img src={form.image_url[0]} alt="Preview" className="w-20 h-20 object-cover mt-2 border" />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black transition-colors"
          >
            {editId ? "UPDATE LISTING" : "CREATE LISTING"}
          </button>
        </form>
      )}

      {/* Listings Table */}
      <div className="bg-white border border-[#E8E8E8] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E8E8]">
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Image</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Title</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Brand</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Price</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Seller</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA]">
                <td className="px-4 py-3">
                  <img src={listing.image_url[0]} alt="" className="w-10 h-10 object-cover" />
                </td>
                <td className="px-4 py-3 text-xs">{listing.title}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{listing.brand}</td>
                <td className="px-4 py-3 text-xs font-medium">${listing.listed_price.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{getProfileById(listing.seller_id)?.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Pencil className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
