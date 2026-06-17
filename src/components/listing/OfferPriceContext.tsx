"use client";

/**
 * Step 1 offer info box — price-context indicator.
 *
 * Renders one of THREE explicit paths, selected by a tri-state flag so that a
 * permanently-missing item can never get stuck on the loading placeholder:
 *
 *   1. has data    → `{ min, max, lastSold }`  → Competitive/Low label + range box
 *   2. loading     → `"loading"`               → skeleton, reserves vertical space
 *   3. unavailable → `"unavailable"`           → renders nothing at all
 *
 * Critical: states 2 and 3 are distinguished by the flag itself, NOT by
 * inspecting whether a value is currently null. Callers must resolve their
 * fetch to "unavailable" once it settles with no data — passing a perpetual
 * null would (incorrectly) read as still-loading.
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

// Fixed height shared by states 1 and 2 so the CTA below never shifts when the
// fetch resolves loading → has-data. State 3 intentionally reserves nothing.
const RESERVED_MIN_HEIGHT = 60;

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
      <div className="mb-4" style={{ minHeight: RESERVED_MIN_HEIGHT }} aria-hidden>
        <div className="animate-pulse border border-[#E8E8E8] px-3 py-2.5">
          <div className="h-[10px] w-24 bg-[#ECECEC] rounded mb-2" />
          <div className="h-[10px] w-44 bg-[#F2F2F2] rounded" />
        </div>
      </div>
    );
  }

  // ── State 1: has data ──
  const { min, max, lastSold } = state;
  const hasOffer = offerAmount > 0;
  const isCompetitive = hasOffer && offerAmount >= min;

  // Before the buyer types an amount, present the range as neutral guidance
  // rather than prematurely labelling the (empty) offer "Low".
  const label = !hasOffer ? "Competitive range" : isCompetitive ? "Competitive" : "Low";
  const dotColor = !hasOffer ? "#888888" : isCompetitive ? "#1E9E62" : "#CC0000";
  const labelColor = !hasOffer ? "#555555" : isCompetitive ? "#1E7A4D" : "#CC0000";

  return (
    <div className="mb-4" style={{ minHeight: RESERVED_MIN_HEIGHT }}>
      <div className="border border-[#E8E8E8] px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className="w-[7px] h-[7px] rounded-full flex-shrink-0"
            style={{ backgroundColor: dotColor }}
          />
          <span className="text-[12px] font-semibold" style={{ color: labelColor }}>
            {label}
          </span>
        </div>
        <p className="text-[11px] text-[#888] leading-relaxed">
          Competitive offers fall between{" "}
          <span className="text-[#555] font-medium">${min.toLocaleString()}</span> –{" "}
          <span className="text-[#555] font-medium">${max.toLocaleString()}</span>
          {typeof lastSold === "number" && (
            <>
              {" "}· Last sold{" "}
              <span className="text-[#555] font-medium">${lastSold.toLocaleString()}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
