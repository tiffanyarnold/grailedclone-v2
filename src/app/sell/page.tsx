"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ChevronDown, Camera } from "lucide-react";

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
  { value: "new", label: "New / Never Worn" },
  { value: "gently_used", label: "Gently Used" },
  { value: "used", label: "Used" },
  { value: "very_worn", label: "Very Worn" },
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
  placeholder,
  options,
  value,
  onChange,
  disabled,
}: {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
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
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888] pointer-events-none" />
    </div>
  );
}

function SectionTitle({ children, link, linkLabel }: { children: React.ReactNode; link?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2
        className="text-[22px] font-bold text-[#1A1A1A]"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: 700 }}
      >
        {children}
      </h2>
      {linkLabel && (
        <a
          href={link || "#"}
          className="text-[12px] font-bold tracking-[0.08em] text-[#0000EE] hover:underline"
          style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
        >
          {linkLabel} →
        </a>
      )}
    </div>
  );
}

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
  const [floorPrice, setFloorPrice] = useState("");
  const [acceptOffers, setAcceptOffers] = useState(true);
  const [smartPricing, setSmartPricing] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      openLoginModal("login");
    }
  }, [user, openLoginModal]);

  if (!user) return null;

  const subcategoryOptions = department ? SUBCATEGORIES[department] || [] : [];
  const sizeOptions = subcategory ? SIZES[subcategory] || ["One Size"] : [];

  const handleDepartmentChange = (v: string) => {
    setDepartment(v);
    setSubcategory("");
    setSize("");
  };

  const handleSubcategoryChange = (v: string) => {
    setSubcategory(v);
    setSize("");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, url].slice(0, 9));
    });
  };

  const handlePublish = () => {
    alert("Listing published! (Demo)");
    router.push("/seller/dashboard");
  };

  const handleSaveDraft = () => {
    alert("Saved as draft! (Demo)");
  };

  return (
    <div
      className="min-h-screen bg-white pb-24"
      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
    >
      {/* Page header */}
      <div className="max-w-[860px] mx-auto px-4 sm:px-8 pt-10 pb-2">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-[28px] sm:text-[32px] font-bold text-[#1A1A1A]"
            style={{ fontWeight: 700 }}
          >
            Add a new listing
          </h1>
          <a
            href="#"
            className="text-[12px] font-bold tracking-[0.06em] text-[#0000EE] hover:underline whitespace-nowrap"
          >
            HOW TO SELL GUIDE →
          </a>
        </div>

        {/* ── DETAILS ── */}
        <section className="mb-10">
          <SectionTitle>Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField
              placeholder="Department / Category"
              options={DEPARTMENTS}
              value={department}
              onChange={handleDepartmentChange}
            />
            <SelectField
              placeholder="Sub-category (Select category first)"
              options={subcategoryOptions}
              value={subcategory}
              onChange={handleSubcategoryChange}
              disabled={!department}
            />
            <input
              type="text"
              placeholder="Designer (Select category first)"
              value={designer}
              onChange={(e) => setDesigner(e.target.value)}
              disabled={!department}
              className={`border border-[#D4D4D4] px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#888] ${
                !department ? "opacity-40 cursor-not-allowed" : ""
              }`}
            />
            <SelectField
              placeholder="Select Size (Select category first)"
              options={sizeOptions}
              value={size}
              onChange={setSize}
              disabled={!subcategory}
            />
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
            <SelectField
              placeholder="Select a Color"
              options={COLORS}
              value={color}
              onChange={setColor}
            />
          </div>
        </section>

        {/* ── CONDITION ── */}
        <section className="mb-10">
          <SectionTitle>Condition</SectionTitle>
          <div className="w-full sm:w-[460px]">
            <SelectField
              placeholder="Item Condition"
              options={CONDITIONS.map((c) => c.label)}
              value={CONDITIONS.find((c) => c.value === condition)?.label || ""}
              onChange={(label) => {
                const found = CONDITIONS.find((c) => c.label === label);
                if (found) setCondition(found.value);
              }}
            />
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
            <SelectField
              placeholder="Select a Style"
              options={STYLES}
              value={style}
              onChange={setStyle}
            />
          </div>
        </section>

        {/* ── COUNTRY OF ORIGIN ── */}
        <section className="mb-10">
          <SectionTitle>Where was your item made?</SectionTitle>
          <p className="text-[13px] mb-3">
            Provide the{" "}
            <strong className="font-semibold">country of origin for this product</strong>{" "}
            for customs
          </p>
          <div className="w-full sm:w-[460px]">
            <SelectField
              placeholder="Country name"
              options={COUNTRIES}
              value={country}
              onChange={setCountry}
            />
          </div>
        </section>

        {/* ── PRICE ── */}
        <section className="mb-10">
          <SectionTitle linkLabel="PRICING TIPS">Price</SectionTitle>

          {/* Price input */}
          <div className="w-full sm:w-[460px] flex items-center border border-[#D4D4D4] mb-6">
            <span className="px-3 text-[#888] text-sm border-r border-[#D4D4D4] py-3">$</span>
            <input
              type="number"
              placeholder="Price (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 px-3 py-3 text-sm outline-none placeholder:text-[#888]"
            />
          </div>

          {/* Accept Offers */}
          <div className="flex items-center justify-between w-full sm:w-[460px] mb-5">
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
                Smart Pricing automatically drops the price of your listing by 10% at the best time every week until it hits your floor price.
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

        {/* ── SHIPPING FROM ── */}
        <section className="mb-10">
          <SectionTitle linkLabel="SHIPPING TIPS">Shipping From</SectionTitle>

          {/* Info banner */}
          <div className="border border-[#0000EE]/30 bg-[#F0F0FF] px-4 py-3 mb-4 text-[13px] text-[#1A1A1A] leading-relaxed">
            <span className="font-bold text-[#0000EE]">UPDATE</span>{" "}
            Please note, once you publish or save as draft, all new listings will initially default to the inputted return address below. The Default Return Address can be managed in Settings, under{" "}
            <a href="#" className="underline text-[#0000EE]">Addresses</a>.
          </div>

          <p className="text-[13px] text-[#888] mb-3">
            Shipping options vary depending on the address you&apos;re sending your item from.
          </p>

          {/* Address select box */}
          <button
            type="button"
            className="w-full border border-red-400 px-4 py-4 flex items-center justify-between text-[13px] text-[#888] hover:bg-[#FAFAFA] transition-colors"
          >
            <span>Select address</span>
            <span className="text-[#888]">›</span>
          </button>
        </section>

        {/* ── PHOTOS ── */}
        <section className="mb-10">
          <SectionTitle linkLabel="PHOTO TIPS">Photos</SectionTitle>

          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-1">
            {/* Main large cell */}
            <div className="row-span-2 relative bg-[#F2F2F2] aspect-square flex items-center justify-center cursor-pointer hover:bg-[#E8E8E8] transition-colors overflow-hidden">
              {photos[0] ? (
                <img src={photos[0]} alt="Photo 1" className="w-full h-full object-cover" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Camera className="w-8 h-8 text-[#888]" strokeWidth={1.5} />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                </label>
              )}
            </div>
            {/* 8 small cells */}
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="relative bg-[#F2F2F2] aspect-square flex items-center justify-center cursor-pointer hover:bg-[#E8E8E8] transition-colors overflow-hidden">
                {photos[i + 1] ? (
                  <img src={photos[i + 1]} alt={`Photo ${i + 2}`} className="w-full h-full object-cover" />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <Camera className="w-5 h-5 text-[#888]" strokeWidth={1.5} />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── STICKY BOTTOM BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E8] z-40">
        <div className="max-w-[860px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-end gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-6 sm:px-10 py-3 text-[12px] font-bold tracking-[0.1em] border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
          >
            SAVE AS DRAFT
          </button>
          <button
            onClick={handlePublish}
            className="px-6 sm:px-10 py-3 text-[12px] font-bold tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-black transition-colors"
          >
            PUBLISH
          </button>
        </div>
      </div>
    </div>
  );
}
