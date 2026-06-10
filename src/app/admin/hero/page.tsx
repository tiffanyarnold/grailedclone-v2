"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import { GripVertical, Plus, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminHeroPage() {
  const { heroSlides, listings, addHeroSlide, removeHeroSlide, updateHeroSlide } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    listing_id: "",
    headline: "",
    subheadline: "",
    button_text: "SHOP NOW",
    image: "",
  });

  const sortedSlides = [...heroSlides].sort((a, b) => a.position - b.position);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const listing = listings.find((l) => l.id === form.listing_id);
    await addHeroSlide({
      listing_id: form.listing_id,
      headline: form.headline,
      subheadline: form.subheadline,
      button_text: form.button_text,
      image: form.image || listing?.image_url[0] || "",
      position: heroSlides.length + 1,
      active: true,
    });
    setForm({ listing_id: "", headline: "", subheadline: "", button_text: "SHOP NOW", image: "" });
    setShowForm(false);
  };

  const moveSlide = async (id: string, direction: "up" | "down") => {
    const idx = sortedSlides.findIndex((s) => s.id === id);
    if (direction === "up" && idx > 0) {
      await updateHeroSlide(sortedSlides[idx].id, { position: sortedSlides[idx].position - 1 });
      await updateHeroSlide(sortedSlides[idx - 1].id, { position: sortedSlides[idx - 1].position + 1 });
    }
    if (direction === "down" && idx < sortedSlides.length - 1) {
      await updateHeroSlide(sortedSlides[idx].id, { position: sortedSlides[idx].position + 1 });
      await updateHeroSlide(sortedSlides[idx + 1].id, { position: sortedSlides[idx + 1].position - 1 });
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Hero Carousel</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          ADD SLIDE
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-[#E8E8E8] p-6 mb-6">
          <h2 className="text-sm font-bold mb-4">New Hero Slide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Listing</label>
              <select
                value={form.listing_id}
                onChange={(e) => setForm({ ...form, listing_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none bg-white"
                required
              >
                <option value="">Select listing...</option>
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>{l.title} - ${l.listed_price}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Headline</label>
              <input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Subheadline</label>
              <input
                value={form.subheadline}
                onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Button Text</label>
              <input
                value={form.button_text}
                onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Image URL (optional)</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
                placeholder="Leave empty to use listing image"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black"
          >
            ADD TO CAROUSEL
          </button>
        </form>
      )}

      {/* Slides Table */}
      <div className="bg-white border border-[#E8E8E8] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E8E8]">
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3 w-8"></th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Thumbnail</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Headline</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Position</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Active</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSlides.map((slide, index) => (
              <tr key={slide.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA]">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveSlide(slide.id, "up")}
                      disabled={index === 0}
                      className="text-[10px] text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveSlide(slide.id, "down")}
                      disabled={index === sortedSlides.length - 1}
                      className="text-[10px] text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <img src={slide.image} alt="" className="w-16 h-10 object-cover" />
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs font-medium">{slide.headline}</p>
                  <p className="text-[10px] text-gray-500">{slide.subheadline}</p>
                </td>
                <td className="px-4 py-3 text-xs">{slide.position}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => updateHeroSlide(slide.id, { active: !slide.active })}
                    className={`p-1 rounded ${slide.active ? "text-green-600" : "text-gray-400"}`}
                  >
                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => removeHeroSlide(slide.id)}
                    className="p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
