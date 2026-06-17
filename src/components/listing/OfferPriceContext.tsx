"use client";

/**
 * Step 1 offer info box — Competitive/Low indicator.
 *
 * Renders one of THREE explicit paths, selected by a tri-state flag so that a
 * permanently-missing item can never get stuck on the loading placeholder:
 *
 *   1. has data    → `{ min, max, lastSold }`  → Competitive/Low label + helper box
 *   2. loading     → `"loading"`               → skeleton, reserves vertical space
 *   3. unavailable → `"unavailable"`           → renders nothing at all
 *
 * Critical: states 2 and 3 are distinguished by the flag itself, NOT by
 * inspecting whether a value is currently null. Callers must resolve their
 * fetch to "unavailable" once it settles with no data.
 *
 * Within the has-data path, the label only appears once the buyer has typed a
 * positive amount (offerAmount > 0). The Competitive vs Low decision compares
 * that amount to `min` (= competitive_range_min) in real time — no fetch.
 */

export type PriceContextData = {
  min: number;
  max: number;
  lastSold?: number | null;
};

export type PriceContextState = "loading" | "unavailable" | PriceContextData;

/** Type guard: true only for the has-data branch (state 1). */
export function hasPriceContextData(
  state: PriceContextState
): state is PriceContextData {
  return typeof state === "object" && state !== null;
}

// Shared height for the loading skeleton and the resolved label+box so the
// loading → resolved transition causes no layout shift.
const RESERVED_MIN_HEIGHT = 72;

const COMPETITIVE = {
  label: "Competitive",
  dot: "#1E9E62",
  labelColor: "#1E7A4D",
  border: "#BFE3CD",
  bg: "#EAF6EF",
  helperColor: "#2F6B4A",
  helper: "Your offer is within the typical accepted range for this item.",
};

const LOW = {
  label: "Low",
  dot: "#CC0000",
  labelColor: "#CC0000",
  border: "#F3C9C9",
  bg: "#FDECEC",
  helperColor: "#B23A3A",
  helper: "Offers this far below the asking price are rarely accepted on Grailed.",
};

export default function OfferPriceContext({
  state,
  offerAmount,
}: {
  state: PriceContextState;
  offerAmount: number;
}) {
  // ── State 3: permanently missing ──
  // Render nothing — no dot, no text, no box, no reserved placeholder space.
  if (state === "unavailable") return null;

  // ── State 2: loading ──
  // Reserved-height skeleton keeps layout stable until data resolves.
  if (state === "loading") {
    return (
      <div className="mb-3" style={{ minHeight: RESERVED_MIN_HEIGHT }} aria-hidden>
        <div className="h-[12px] w-24 bg-[#ECECEC] rounded mb-2 animate-pulse" />
        <div className="animate-pulse border border-[#E8E8E8] px-3 py-2.5">
          <div className="h-[10px] w-full bg-[#F2F2F2] rounded mb-1.5" />
          <div className="h-[10px] w-2/3 bg-[#F2F2F2] rounded" />
        </div>
      </div>
    );
  }

  // ── State 1: has data ──
  // No label until the buyer enters a positive amount.
  if (offerAmount <= 0) return null;

  const cfg = offerAmount >= state.min ? COMPETITIVE : LOW;

  return (
    <div className="mb-3" style={{ minHeight: RESERVED_MIN_HEIGHT }}>
      {/* Dot + Competitive/Low label */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span
          className="w-[8px] h-[8px] rounded-full flex-shrink-0"
          style={{ backgroundColor: cfg.dot }}
        />
        <span className="text-[13px] font-semibold" style={{ color: cfg.labelColor }}>
          {cfg.label}
        </span>
      </div>

      {/* Helper copy box */}
      <div
        className="px-3 py-2.5 border"
        style={{ borderColor: cfg.border, backgroundColor: cfg.bg }}
      >
        <p className="text-[12px] leading-relaxed" style={{ color: cfg.helperColor }}>
          {cfg.helper}
        </p>
      </div>
    </div>
  );
}
