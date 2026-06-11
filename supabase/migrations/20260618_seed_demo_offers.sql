-- Seed demo offers for marcus@seller.com and elena@seller.com
-- Ensures each seller has at least one pending offer visible in their dashboard
-- Also seeds min_offer_price (~85% of listed_price) on all listings that are missing it

-- ── Step 1: Seed min_offer_price on all listings that don't have one ──────────
UPDATE public.listings
SET min_offer_price = ROUND(listed_price * 0.85)
WHERE min_offer_price IS NULL;

-- ── Step 2: Seed demo offers ──────────────────────────────────────────────────
DO $$
DECLARE
  v_marcus_id   UUID;
  v_elena_id    UUID;
  v_buyer_id    UUID;
  v_listing_id  UUID;
BEGIN

  -- ── Get seller profile IDs ──
  SELECT id INTO v_marcus_id
  FROM public.profiles
  WHERE email = 'marcus@seller.com'
  LIMIT 1;

  SELECT id INTO v_elena_id
  FROM public.profiles
  WHERE email = 'elena@seller.com'
  LIMIT 1;

  -- ── Get a buyer to make the offers (first non-seller user, or any user) ──
  SELECT id INTO v_buyer_id
  FROM public.profiles
  WHERE role = 'buyer'
  ORDER BY created_at ASC
  LIMIT 1;

  -- Fallback: use any user that is not marcus or elena
  IF v_buyer_id IS NULL THEN
    SELECT id INTO v_buyer_id
    FROM public.profiles
    WHERE id != v_marcus_id AND id != v_elena_id
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;

  -- ── Offer for marcus@seller.com ──────────────────────────────────────────
  IF v_marcus_id IS NOT NULL AND v_buyer_id IS NOT NULL THEN

    -- Pick one of marcus's listings
    SELECT id INTO v_listing_id
    FROM public.listings
    WHERE seller_id = v_marcus_id
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_listing_id IS NOT NULL THEN
      -- Insert a pending offer if none exists yet for this listing
      INSERT INTO public.offers (listing_id, buyer_id, amount, status, created_at)
      SELECT
        v_listing_id,
        v_buyer_id,
        ROUND((SELECT listed_price FROM public.listings WHERE id = v_listing_id) * 0.82),
        'pending',
        NOW() - INTERVAL '2 hours'
      WHERE NOT EXISTS (
        SELECT 1 FROM public.offers
        WHERE listing_id = v_listing_id
          AND buyer_id   = v_buyer_id
          AND status     = 'pending'
      );
      RAISE NOTICE 'Seeded pending offer for marcus@seller.com on listing %', v_listing_id;
    ELSE
      RAISE NOTICE 'No listing found for marcus@seller.com — skipping offer seed.';
    END IF;

  ELSE
    RAISE NOTICE 'marcus@seller.com or buyer not found — skipping offer seed.';
  END IF;

  -- ── Offer for elena@seller.com ───────────────────────────────────────────
  IF v_elena_id IS NOT NULL AND v_buyer_id IS NOT NULL THEN

    -- Pick one of elena's listings
    SELECT id INTO v_listing_id
    FROM public.listings
    WHERE seller_id = v_elena_id
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_listing_id IS NOT NULL THEN
      INSERT INTO public.offers (listing_id, buyer_id, amount, status, created_at)
      SELECT
        v_listing_id,
        v_buyer_id,
        ROUND((SELECT listed_price FROM public.listings WHERE id = v_listing_id) * 0.78),
        'pending',
        NOW() - INTERVAL '1 hour'
      WHERE NOT EXISTS (
        SELECT 1 FROM public.offers
        WHERE listing_id = v_listing_id
          AND buyer_id   = v_buyer_id
          AND status     = 'pending'
      );
      RAISE NOTICE 'Seeded pending offer for elena@seller.com on listing %', v_listing_id;
    ELSE
      RAISE NOTICE 'No listing found for elena@seller.com — skipping offer seed.';
    END IF;

  ELSE
    RAISE NOTICE 'elena@seller.com or buyer not found — skipping offer seed.';
  END IF;

END $$;
