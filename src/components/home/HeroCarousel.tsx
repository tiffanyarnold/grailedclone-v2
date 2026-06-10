"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store-context";
import Link from "next/link";

const FALLBACK_SLIDES = [
  {
    id: "fallback-1",
    headline: "Archive Under $300",
    subheadline: "RAF SIMONS, UNDERCOVER + MORE",
    button_text: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1800&q=85",
    listing_id: "",
    position: 0,
    active: true,
  },
  {
    id: "fallback-2",
    headline: "Luxury Streetwear",
    subheadline: "SUPREME, PALACE + MORE",
    button_text: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1800&q=85",
    listing_id: "",
    position: 1,
    active: true,
  },
  {
    id: "fallback-3",
    headline: "Designer Footwear",
    subheadline: "NIKE, JORDAN BRAND + MORE",
    button_text: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1800&q=85",
    listing_id: "",
    position: 2,
    active: true,
  },
  {
    id: "fallback-4",
    headline: "New Arrivals Daily",
    subheadline: "STAFF PICKS",
    button_text: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1800&q=85",
    listing_id: "",
    position: 3,
    active: true,
  },
];

export default function HeroCarousel() {
  const { heroSlides } = useStore();
  const sorted = heroSlides
    .filter((s) => s.active)
    .sort((a, b) => a.position - b.position);
  const activeSlides = sorted.length > 0 ? sorted : FALLBACK_SLIDES;

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setCurrent(index);
      setTimeout(() => setTransitioning(false), 600);
    },
    [transitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % activeSlides.length);
  }, [current, activeSlides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + activeSlides.length) % activeSlides.length);
  }, [current, activeSlides.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = activeSlides[current];

  return (
    <div
      className="relative w-full overflow-hidden bg-black select-none h-[380px] sm:h-[460px] lg:h-[560px]"
    >
      {/* Slides */}
      {activeSlides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-500 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
          }}
        >
          <img
            src={s.image}
            alt={s.headline}
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.50) 100%)",
            }}
          />
        </div>
      ))}

      {/* Center content — exactly like Grailed */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
        style={{ zIndex: 2 }}
      >
        {/* Subheadline / brand tags */}
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "10px",
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          {slide.subheadline}
        </p>

        {/* Bold headline */}
        <h2
          style={{
            fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(28px, 5vw, 66px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            marginBottom: "28px",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            maxWidth: "800px",
            padding: "0 24px",
          }}
        >
          {slide.headline}
        </h2>

        {/* SHOP NOW button — outlined, no border-radius, exactly Grailed */}
        <Link
          href="/browse"
          style={{
            display: "inline-block",
            border: "1.5px solid rgba(255,255,255,0.85)",
            color: "#ffffff",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            padding: "10px 40px",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 0.18s ease, color 0.18s ease",
          }}
          className="hover:bg-white hover:!text-black"
        >
          {slide.button_text || "SHOP NOW"}
        </Link>
      </div>

      {/* Left Arrow — full-height clickable strip on far left */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        style={{ zIndex: 3 }}
        className="absolute left-0 top-0 h-full w-10 lg:w-14 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-150"
      >
        <ChevronLeft style={{ width: "26px", height: "26px", strokeWidth: 2 }} />
      </button>

      {/* Right Arrow — full-height clickable strip on far right */}
      <button
        onClick={next}
        aria-label="Next slide"
        style={{ zIndex: 3 }}
        className="absolute right-0 top-0 h-full w-10 lg:w-14 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-150"
      >
        <ChevronRight style={{ width: "26px", height: "26px", strokeWidth: 2 }} />
      </button>

      {/* Dot indicators — centered at bottom, exactly like Grailed */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-[7px]"
        style={{ zIndex: 3 }}
      >
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                i === current ? "#ffffff" : "rgba(255,255,255,0.4)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
