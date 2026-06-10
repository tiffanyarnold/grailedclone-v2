"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import { useProfiles } from "@/lib/use-profiles";
import { Plus, Pencil, Trash2, X, ImagePlus } from "lucide-react";

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
    listed_price: "",
    sale_price: "",
    discount: "",
    seller_id: "",
    image_url: [""],
  });

  const resetForm = () => {
    setForm({
      title: "",
      brand: "",
      description: "",
      category: "Tops",
      size: "",
      condition: "Gently Used",
      listed_price: "",
      sale_price: "",
      discount: "",
      seller_id: sellers[0]?.id || "",
      image_url: [""],
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty image URLs
    const validImages = form.image_url.filter((url) => url.trim() !== "");
    if (validImages.length === 0) {
      alert("Please add at least one image URL.");
      return;
    }
    if (!form.seller_id) {
      alert("Please select a seller.");
      return;
    }

    const payload: any = {
      title: form.title,
      brand: form.brand,
      description: form.description,
      category: form.category,
      size: form.size,
      condition: form.condition,
      listed_price: parseFloat(form.listed_price),
      seller_id: form.seller_id,
      image_url: validImages,
    };

    // Add optional sale_price
    if (form.sale_price.trim()) {
      payload.sale_price = parseFloat(form.sale_price);
    } else {
      payload.sale_price = null;
    }

    // Add optional discount
    if (form.discount.trim()) {
      payload.discount = parseFloat(form.discount);
    } else {
      payload.discount = null;
    }

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
      listed_price: listing.listed_price?.toString() || "",
      sale_price: listing.sale_price?.toString() || "",
      discount: listing.discount?.toString() || "",
      seller_id: listing.seller_id,
      image_url: listing.image_url?.length > 0 ? listing.image_url : [""],
    });
    setEditId(listing.id);
    setShowForm(true);
  };

  // Multi-image handlers
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...form.image_url];
    newImages[index] = value;
    setForm({ ...form, image_url: newImages });
  };

  const addImageField = () => {
    setForm({ ...form, image_url: [...form.image_url, ""] });
  };

  const removeImageField = (index: number) => {
    if (form.image_url.length <= 1) return;
    const newImages = form.image_url.filter((_, i) => i !== index);
    setForm({ ...form, image_url: newImages });
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Listings</h1>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setForm((prev) => ({ ...prev, seller_id: sellers[0]?.id || "" }));
              setShowForm(true);
            }
          }}
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
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Listed Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.listed_price}
                onChange={(e) => setForm({ ...form, listed_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Sale Price ($) <span className="text-gray-400 normal-case">optional</span></label>
              <input
                type="number"
                step="0.01"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                placeholder="Leave blank if no sale"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Discount (%) <span className="text-gray-400 normal-case">optional</span></label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                placeholder="e.g. 20"
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
                  <option key={s.id} value={s.id}>
                    {s.name || s.email} ({s.role})
                  </option>
                ))}
              </select>
              {sellers.length === 0 && (
                <p className="text-[10px] text-red-500 mt-1">No sellers found. Make sure there are users with &quot;seller&quot; role in the system.</p>
              )}
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

            {/* Multi-Image URLs */}
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-2">
                Image URLs
              </label>
              <div className="space-y-3">
                {form.image_url.map((url, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <input
                        value={url}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                      />
                      {url.trim() && (
                        <div className="mt-2">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                            onLoad={(e) => {
                              (e.target as HTMLImageElement).style.display = "block";
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {form.image_url.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="mt-2 p-1 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#1A1A1A] transition-colors py-1"
                >
                  <ImagePlus className="w-4 h-4" />
                  Add another image
                </button>
              </div>

              {/* Thumbnail preview strip */}
              {form.image_url.filter((u) => u.trim()).length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {form.image_url
                    .filter((u) => u.trim())
                    .map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Thumb ${i + 1}`}
                        className="w-12 h-12 object-cover border border-gray-200 rounded-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ))}
                </div>
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
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Listed Price</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Sale Price</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Discount</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Seller</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA]">
                <td className="px-4 py-3">
                  <img
                    src={listing.image_url?.[0] || ""}
                    alt=""
                    className="w-10 h-10 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&q=60";
                    }}
                  />
                </td>
                <td className="px-4 py-3 text-xs">{listing.title}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{listing.brand}</td>
                <td className="px-4 py-3 text-xs font-medium">${listing.listed_price?.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {listing.sale_price ? `$${listing.sale_price.toLocaleString()}` : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {listing.discount ? `${listing.discount}%` : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{getProfileById(listing.seller_id)?.name || "Unknown"}</td>
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
