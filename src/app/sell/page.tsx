"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ChevronDown, Camera, X, GripVertical, Star } from "lucide-react";

const DEPARTMENTS = ["Menswear", "Womenswear"];

const SUBCATEGORIES: Record<string, string[]> = {
  Menswear: ["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories", "Tailoring", "Knitwear"],
  Womenswear: ["Tops", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories", "Knitwear"],
};

const SIZES: Record<string, string[]> = {
  Tops: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  Bottoms: ["28", "29", "30", "31", "32", "33", "34", "36", "38", "40"],
  Outerwear: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
  Footwear: ["6", "7", "8", "9", "10", "11", "12", "13", "14"],
  Accessories: ["One Size"],
  Tailoring: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
  Knitwear: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
  Dresses: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
};

const COLORS = [
  "Black", "White", "Grey", "Navy", "Blue", "Red", "Green", "Brown",
  "Tan/Khaki", "Beige", "Yellow", "Orange", "Purple", "Pink", "Multi", "Other",
];

const CONDITIONS = [
  { value: "new", label: "New/Never Worn", count: "10k+" },
  { value: "gently_used", label: "Gently Used", count: "10k+" },
  { value: "used", label: "Used", count: "10k+" },
  { value: "very_worn", label: "Very Worn", count: "244" },
  { value: "not_specified", label: "Not Specified", count: "1" },
];

const STYLES = [
  "Avant Garde", "Bohemian", "Casual", "Classic American", "Formal",
  "Gorpcore", "Grunge", "Japanese", "Military", "Minimalist",
  "Preppy", "Sportswear", "Streetwear", "Techwear", "Vintage/Retro", "Workwear",
];

const COUNTRIES = [
  "United States", "Japan", "Italy", "France", "United Kingdom", "Germany",
  "China", "South Korea", "Canada", "Portugal", "Spain", "Other",
];

// ── Sub-components ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-[#1A1A1A]" : "bg-[#D4D4D4]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 mt-1 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SelectField({
  placeholder, options, value, onChange, disabled,
}: {
  placeholder: string; options: string[]; value: string;
  onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none border border-[#D4D4D4] px-4 py-3 text-sm bg-white pr-10 outline-none focus:border-[#1A1A1A] transition-colors ${
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        } ${!value ? "text-[#888]" : "text-[#1A1A1A]"}`}
        style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888] pointer-events-none" />
    </div>
  );
}

function SectionTitle({ children, link, linkLabel }: {
  children: React.ReactNode; link?: string; linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2
        className="text-[22px] font-bold text-[#1A1A1A]"
        style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700 }}
      >
        {children}
      </h2>
      {linkLabel && (
        <a href={link || "#"} className="text-[12px] font-bold tracking-[0.08em] text-[#0000EE] hover:underline">
          {linkLabel} →
        </a>
      )}
    </div>
  );
}

// ── Photo item type ──────────────────────────────────────────────────────────
interface PhotoItem {
  id: string;
  url: string;
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function SellPage() {
  const { user, openLoginModal } = useAuth();
  const router = useRouter();

  const [department, setDepartment] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [designer, setDesigner] = useState("");
  const [size, setSize] = useState("");
  const [itemName, setItemName] = useState("");
  const [color, setColor] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [floorPrice, setFloorPrice] = useState("");
  const [acceptOffers, setAcceptOffers] = useState(true);
  const [smartPricing, setSmartPricing] = useState(false);
  const [featuredOnHome, setFeaturedOnHome] = useState(false);

  // Photos
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [previewIdx, setPreviewIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) openLoginModal("login");
  }, [user, openLoginModal]);

  if (!user) return null;

  const subcategoryOptions = department ? SUBCATEGORIES[department] || [] : [];
  const sizeOptions = subcategory ? SIZES[subcategory] || ["One Size"] : [];

  const handleDepartmentChange = (v: string) => { setDepartment(v); setSubcategory(""); setSize(""); };
  const handleSubcategoryChange = (v: string) => { setSubcategory(v); setSize(""); };

  // Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos: PhotoItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 9));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      setPreviewIdx((idx) => Math.min(idx, Math.max(0, next.length - 1)));
      return next;
    });
  };

  // Drag-to-reorder
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragEnter = (idx: number) => setDragOverIdx(idx);
  const handleDragEnd = () => {
    if (dragIdx !== null && dragOverIdx !== null && dragIdx !== dragOverIdx) {
      setPhotos((prev) => {
        const arr = [...prev];
        const [moved] = arr.splice(dragIdx, 1);
        arr.splice(dragOverIdx, 0, moved);
        return arr;
      });
      setPreviewIdx(dragOverIdx);
    }
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const promoteTocover = (i: number) => {
    setPhotos((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(i, 1);
      arr.unshift(moved);
      return arr;
    });
    setPreviewIdx(0);
  };

  const handlePublish = () => { alert("Listing published! (Demo)"); router.push("/seller/dashboard"); };
  const handleSaveDraft = () => alert("Saved as draft! (Demo)");

  const discountPct =
    originalPrice && price && parseFloat(originalPrice) > parseFloat(price)
      ? Math.round((1 - parseFloat(price) / parseFloat(originalPrice)) * 100)
      : null;

  return (
    <div className="min-h-screen bg-white pb-24" style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}>
      <div className="max-w-[920px] mx-auto px-4 sm:px-8 pt-10 pb-2">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#1A1A1A]" style={{ fontWeight: 700 }}>
            Add a new listing
          </h1>
          <a href="#" className="text-[12px] font-bold tracking-[0.06em] text-[#0000EE] hover:underline whitespace-nowrap">
            HOW TO SELL GUIDE →
          </a>
        </div>

        {/* ── PHOTOS ── */}
        <section className="mb-10">
          <SectionTitle linkLabel="PHOTO TIPS">Photos</SectionTitle>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Large preview */}
            <div className="flex-shrink-0 w-full lg:w-[340px]">
              <div className="relative bg-[#F2F2F2] aspect-square overflow-hidden">
                {photos.length > 0 && photos[previewIdx] ? (
                  <>
                    <img src={photos[previewIdx].url} alt="Preview" className="w-full h-full object-contain" />
                    {previewIdx === 0 && (
                      <div className="absolute top-2 left-2 bg-[#1A1A1A] text-white text-[10px] font-bold tracking-[0.08em] px-2 py-1">
                        COVER
                      </div>
                    )}
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full gap-3">
                    <Camera className="w-10 h-10 text-[#C8C8C8]" strokeWidth={1.2} />
                    <span className="text-[13px] text-[#888]">Click to add photos</span>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
              <p className="text-[11px] text-[#888] mt-2">
                {photos.length}/9 · Drag thumbnails to reorder · First = cover
              </p>
            </div>

            {/* Thumbnail grid */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, i) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragEnter={() => handleDragEnter(i)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => setPreviewIdx(i)}
                    className={`relative aspect-square bg-[#F2F2F2] overflow-hidden cursor-grab active:cursor-grabbing border-2 transition-all select-none ${
                      i === previewIdx ? "border-[#1A1A1A]"
                      : dragOverIdx === i ? "border-[#888]"
                      : "border-transparent"
                    } ${dragIdx === i ? "opacity-40" : ""}`}
                  >
                    <img src={photo.url} alt="" className="w-full h-full object-cover pointer-events-none" />

                    {/* Cover badge */}
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A]/70 text-white text-[9px] font-bold text-center py-0.5 tracking-wider">
                        COVER
                      </div>
                    )}

                    {/* Set as cover */}
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); promoteTocover(i); }}
                        title="Set as cover photo"
                        className="absolute top-1 left-1 p-1 bg-white/80 hover:bg-white rounded-sm transition-colors"
                      >
                        <Star className="w-3 h-3 text-[#888]" />
                      </button>
                    )}

                    {/* Drag grip */}
                    <div className="absolute top-1 right-6 p-0.5 bg-white/80 rounded-sm pointer-events-none">
                      <GripVertical className="w-3 h-3 text-[#888]" />
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                      className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white rounded-sm transition-colors"
                    >
                      <X className="w-3 h-3 text-[#888] hover:text-[#DC2626]" />
                    </button>
                  </div>
                ))}

                {/* Add more */}
                {photos.length < 9 && (
                  <label className="aspect-square bg-[#F2F2F2] hover:bg-[#E8E8E8] transition-colors flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-[#D4D4D4] hover:border-[#888]">
                    <Camera className="w-6 h-6 text-[#C8C8C8]" strokeWidth={1.5} />
                    <span className="text-[10px] text-[#888] mt-1">Add photo</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── DETAILS ── */}
        <section className="mb-10">
          <SectionTitle>Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField placeholder="Department / Category" options={DEPARTMENTS} value={department} onChange={handleDepartmentChange} />
            <SelectField placeholder="Sub-category (Select category first)" options={subcategoryOptions} value={subcategory} onChange={handleSubcategoryChange} disabled={!department} />
            <input
              type="text"
              placeholder="Designer (Select category first)"
              value={designer}
              onChange={(e) => setDesigner(e.target.value)}
              disabled={!department}
              className={`border border-[#D4D4D4] px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#888] ${!department ? "opacity-40 cursor-not-allowed" : ""}`}
            />
            <SelectField placeholder="Select Size (Select category first)" options={sizeOptions} value={size} onChange={setSize} disabled={!subcategory} />
          </div>
        </section>

        {/* ── ITEM NAME ── */}
        <section className="mb-10">
          <SectionTitle>Item Name</SectionTitle>
          <input
            type="text"
            placeholder="Item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full sm:w-[460px] border border-[#D4D4D4] px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#888]"
          />
        </section>

        {/* ── COLOR ── */}
        <section className="mb-10">
          <SectionTitle>Color</SectionTitle>
          <div className="w-full sm:w-[460px]">
            <SelectField placeholder="Select a Color" options={COLORS} value={color} onChange={setColor} />
          </div>
        </section>

        {/* ── CONDITION — checkbox list matching Grailed style ── */}
        <section className="mb-10">
          <SectionTitle>Condition</SectionTitle>
          <div className="w-full sm:w-[360px] border border-[#D4D4D4]">
            {CONDITIONS.map((c) => (
              <label
                key={c.value}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#F0F0F0] last:border-0 hover:bg-[#F9F9F9] transition-colors ${
                  condition === c.value ? "bg-[#F5F5F5]" : ""
                }`}
              >
                {/* Custom checkbox */}
                <div className={`w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                  condition === c.value ? "border-[#1A1A1A] bg-[#1A1A1A]" : "border-[#C8C8C8] bg-white"
                }`}>
                  {condition === c.value && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <input type="radio" name="condition" value={c.value} checked={condition === c.value} onChange={() => setCondition(c.value)} className="sr-only" />
                <span className="text-[13px] text-[#1A1A1A] flex-1">{c.label}</span>
                <span className="text-[11px] text-[#888]">{c.count}</span>
              </label>
            ))}
          </div>
        </section>

        {/* ── DESCRIPTION ── */}
        <section className="mb-10">
          <SectionTitle>Description</SectionTitle>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about condition, how the garment fits, additional measurements, shipping policies, retail price, link to retail page, etc"
            rows={5}
            className="w-full border border-[#D4D4D4] px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#888] resize-none"
          />
        </section>

        {/* ── STYLE ── */}
        <section className="mb-10">
          <SectionTitle>Describe your listing&apos;s style</SectionTitle>
          <p className="text-[13px] text-[#888] mb-3">Select one style that best describes your listing.</p>
          <div className="w-full sm:w-[460px]">
            <SelectField placeholder="Select a Style" options={STYLES} value={style} onChange={setStyle} />
          </div>
        </section>

        {/* ── COUNTRY ── */}
        <section className="mb-10">
          <SectionTitle>Where was your item made?</SectionTitle>
          <p className="text-[13px] mb-3">
            Provide the <strong className="font-semibold">country of origin for this product</strong> for customs
          </p>
          <div className="w-full sm:w-[460px]">
            <SelectField placeholder="Country name" options={COUNTRIES} value={country} onChange={setCountry} />
          </div>
        </section>

        {/* ── PRICE ── */}
        <section className="mb-10">
          <SectionTitle linkLabel="PRICING TIPS">Price</SectionTitle>

          {/* Listed price */}
          <p className="text-[11px] text-[#888] mb-1 uppercase tracking-[0.08em] font-semibold">Listed Price</p>
          <div className="w-full sm:w-[460px] flex items-center border border-[#D4D4D4] mb-5">
            <span className="px-3 text-[#888] text-sm border-r border-[#D4D4D4] py-3">$</span>
            <input
              type="number"
              placeholder="Price (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 px-3 py-3 text-sm outline-none placeholder:text-[#888]"
            />
          </div>

          {/* Original / retail price */}
          <p className="text-[11px] text-[#888] mb-1 uppercase tracking-[0.08em] font-semibold">
            Original / Retail Price{" "}
            <span className="normal-case font-normal text-[#AAA]">(optional)</span>
          </p>
          <div className="w-full sm:w-[460px] flex items-center border border-[#D4D4D4] mb-2">
            <span className="px-3 text-[#888] text-sm border-r border-[#D4D4D4] py-3">$</span>
            <input
              type="number"
              placeholder="Retail price — shows discount % to buyers"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="flex-1 px-3 py-3 text-sm outline-none placeholder:text-[#888]"
            />
          </div>

          {/* Live discount preview */}
          {discountPct !== null && (
            <div className="w-full sm:w-[460px] flex items-center gap-3 bg-[#FFF5F5] border border-[#FECACA] px-4 py-2.5 mb-4">
              <span className="text-[13px] font-bold text-[#C62828]">{discountPct}% off</span>
              <span className="text-[13px] text-[#888] line-through">${parseFloat(originalPrice).toLocaleString()}</span>
              <span className="text-[13px] font-bold text-[#1A1A1A]">${parseFloat(price).toLocaleString()}</span>
              <span className="text-[11px] text-[#888] ml-auto">Buyers will see this</span>
            </div>
          )}

          {/* Accept Offers */}
          <div className="flex items-center justify-between w-full sm:w-[460px] mb-5 mt-3">
            <span className="text-[15px] font-semibold">Accept Offers</span>
            <Toggle checked={acceptOffers} onChange={setAcceptOffers} />
          </div>

          {/* Smart Pricing */}
          <div className="flex items-center justify-between w-full sm:w-[460px] mb-3">
            <span className="text-[15px] font-semibold">Smart Pricing</span>
            <Toggle checked={smartPricing} onChange={setSmartPricing} />
          </div>
          {smartPricing && (
            <div className="w-full sm:w-[460px]">
              <p className="text-[13px] text-[#888] mb-3">
                Smart Pricing automatically drops the price by 10% weekly until it hits your floor price.
              </p>
              <div className="flex items-center border border-[#D4D4D4]">
                <span className="px-3 text-[#888] text-sm border-r border-[#D4D4D4] py-3">$</span>
                <input
                  type="number"
                  placeholder="Floor Price (USD)"
                  value={floorPrice}
                  onChange={(e) => setFloorPrice(e.target.value)}
                  className="flex-1 px-3 py-3 text-sm outline-none placeholder:text-[#888]"
                />
              </div>
            </div>
          )}
        </section>

        {/* ── FEATURE ON HOME PAGE ── */}
        <section className="mb-10">
          <SectionTitle>Feature on Home Page</SectionTitle>
          <div className="border border-[#D4D4D4] bg-[#FAFAFA] px-5 py-4 w-full sm:w-[460px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#1A1A1A] mb-1">Show in homepage carousel</p>
                <p className="text-[12px] text-[#888] leading-relaxed">
                  Feature this listing in the hero section on the home page. Best for premium or high-value items.
                </p>
              </div>
              <Toggle checked={featuredOnHome} onChange={setFeaturedOnHome} />
            </div>
            {featuredOnHome && (
              <p className="text-[12px] text-[#2557D6] font-semibold mt-3">
                ✓ This listing will appear in the home page featured section
              </p>
            )}
          </div>
        </section>

        {/* ── SHIPPING FROM ── */}
        <section className="mb-10">
          <SectionTitle linkLabel="SHIPPING TIPS">Shipping From</SectionTitle>
          <div className="border border-[#0000EE]/30 bg-[#F0F0FF] px-4 py-3 mb-4 text-[13px] text-[#1A1A1A] leading-relaxed">
            <span className="font-bold text-[#0000EE]">UPDATE</span>{" "}
            Please note, once you publish or save as draft, all new listings will default to the inputted return address below. Manage in Settings under{" "}
            <a href="#" className="underline text-[#0000EE]">Addresses</a>.
          </div>
          <p className="text-[13px] text-[#888] mb-3">
            Shipping options vary depending on the address you&apos;re sending your item from.
          </p>
          <button type="button" className="w-full border border-red-400 px-4 py-4 flex items-center justify-between text-[13px] text-[#888] hover:bg-[#FAFAFA] transition-colors">
            <span>Select address</span>
            <span className="text-[#888]">›</span>
          </button>
        </section>

      </div>

      {/* ── STICKY BOTTOM BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E8] z-40">
        <div className="max-w-[920px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-end gap-3">
          <button onClick={handleSaveDraft} className="px-6 sm:px-10 py-3 text-[12px] font-bold tracking-[0.1em] border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors">
            SAVE AS DRAFT
          </button>
          <button onClick={handlePublish} className="px-6 sm:px-10 py-3 text-[12px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors">
            PUBLISH
          </button>
        </div>
      </div>
    </div>
  );
}
