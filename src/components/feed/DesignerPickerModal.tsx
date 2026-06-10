"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const DESIGNERS = [
  "VINTAGE", "JAPANESE BRAND", "NIKE",
  "OTHER", "BAND TEES", "BALENCIAGA",
  "POLO RALPH LAUREN", "LOUIS VUITTON", "LEVI'S",
  "ADIDAS", "GUCCI", "BURBERRY",
  "JORDAN BRAND", "JEAN", "IF SIX WAS NINE",
  "SUPREME", "HYSTERIC GLAMOUR", "JEWELRY",
  "RICK OWENS", "CHROME HEARTS", "SAINT LAURENT",
  "UNDERCOVER", "MAISON MARGIELA", "OFF-WHITE",
  "RAF SIMONS", "STÜSSY", "COMME DES GARÇONS",
  "ACNE STUDIOS", "STONE ISLAND", "DIOR",
];

const STORAGE_KEY = "grailed_followed_designers";

export function getFollowedDesigners(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveFollowedDesigners(designers: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(designers));
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DesignerPickerModal({ open, onClose }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  // Load existing selections on open
  useEffect(() => {
    if (open) {
      const saved = getFollowedDesigners();
      setSelected(new Set(saved));
      setSearch("");
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const toggle = (designer: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(designer)) {
        next.delete(designer);
      } else {
        next.add(designer);
      }
      return next;
    });
  };

  const handleDone = () => {
    saveFollowedDesigners(Array.from(selected));
    onClose();
    router.push("/feed");
  };

  const filtered = search.trim()
    ? DESIGNERS.filter((d) => d.toLowerCase().includes(search.trim().toLowerCase()))
    : DESIGNERS;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative bg-white w-full max-w-[560px] mx-4 rounded-lg shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh", fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <h2
            className="text-[26px] font-bold text-[#1A1A1A] leading-tight"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            What designers are you into?
          </h2>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#1A1A1A] transition-colors ml-4 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtext */}
        <p className="px-8 pb-4 text-sm text-[#555] leading-relaxed">
          Follow 5 of your favorite designers to see personalized recommendations.
        </p>

        {/* Search */}
        <div className="px-8 pb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all designers"
            className="w-full px-4 py-3 border border-[#D4D4D4] text-sm outline-none focus:border-[#1A1A1A] rounded-sm"
          />
        </div>

        {/* Designer grid — scrollable */}
        <div className="px-8 pb-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-2">
            {filtered.map((designer) => {
              const isSelected = selected.has(designer);
              return (
                <button
                  key={designer}
                  onClick={() => toggle(designer)}
                  className={`px-3 py-4 text-[11px] font-bold tracking-[0.06em] border transition-colors text-center leading-tight
                    ${isSelected
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-[#D4D4D4] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]"
                    }`}
                >
                  {designer}
                </button>
              );
            })}
          </div>
        </div>

        {/* Done button */}
        <div className="px-8 py-5 border-t border-[#E8E8E8] bg-[#F5F5F5]">
          <button
            onClick={handleDone}
            disabled={selected.size === 0}
            className={`w-full py-[14px] text-[12px] font-bold tracking-[0.1em] transition-colors
              ${selected.size > 0
                ? "bg-[#1A1A1A] text-white hover:bg-black cursor-pointer"
                : "bg-[#D4D4D4] text-[#888] cursor-not-allowed"
              }`}
          >
            Done {selected.size > 0 ? `(${selected.size} selected)` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
