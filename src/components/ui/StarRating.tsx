"use client";

import { Star } from "lucide-react";

/**
 * Shared star-rating display used on buyer/seller cards so ratings render
 * identically everywhere (listing seller card, seller dashboard header,
 * offer cards). Amber filled stars up to `Math.round(rating)`.
 */
export default function StarRating({
  rating,
  reviews,
  size = 12,
  showValue = true,
  className = "",
}: {
  rating: number;
  reviews: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const filled = Math.round(rating);
  const hasReviews = reviews > 0;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showValue && hasReviews && (
        <span className="text-[12px] text-[#1A1A1A] font-medium">{rating.toFixed(1)}</span>
      )}
      <span className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const active = hasReviews && i <= filled;
          return (
            <Star
              key={i}
              style={{ width: size, height: size }}
              fill={active ? "#F5A623" : "none"}
              stroke={active ? "#F5A623" : "#CCCCCC"}
              strokeWidth={1.5}
            />
          );
        })}
      </span>
      <span className="text-[11px] text-[#888] ml-0.5">
        {hasReviews ? `${reviews} Review${reviews > 1 ? "s" : ""}` : "No Reviews"}
      </span>
    </div>
  );
}
