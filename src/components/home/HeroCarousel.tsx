"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store-context";
import Link from "next/link";

export default function HeroCarousel() {
  const { heroSlides } = useStore();
  const activeSlides = heroSlides.filter((s) => s.active).sort((a, b) => a.position - b.position);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (activeSlides.length === 0) return null;

  const slide = activeSlides[current];

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-black">
      {/* Image */}
      {activeSlides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.headline}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10">
        <p className="text-sm tracking-[0.12em] uppercase mb-2 font-medium">
          {slide.subheadline}
        </p>
        <h2 className="text-5xl font-bold mb-6 tracking-tight">
          {slide.headline}
        </h2>
        <Link
          href="/browse"
          className="border border-white px-8 py-3 text-sm font-bold tracking-[0.1em] hover:bg-white hover:text-black transition-all duration-200"
        >
          {slide.button_text}
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:opacity-70 transition-opacity"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:opacity-70 transition-opacity"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
