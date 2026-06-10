-- ── Listings: Week 1 missing fields ─────────────────────────────────────────
ALTER TABLE public.listings
  -- Step 1 offer modal floor validation (e.g. 70% of listed_price by default)
  ADD COLUMN IF NOT EXISTS min_offer_price      NUMERIC,

-- ── Listings: Week 2 missing fields ─────────────────────────────────────────
  -- Lower bound for "Competitive" label on offer (e.g. 85% of listed_price)
  ADD COLUMN IF NOT EXISTS competitive_range_min NUMERIC,
  -- Upper bound for competitive range / seller nudge card
  ADD COLUMN IF NOT EXISTS competitive_range_max NUMERIC,
  -- Last sold price shown in PDP price context area
  ADD COLUMN IF NOT EXISTS last_sold_price       NUMERIC,
  -- Lowest active ask shown in PDP price context area
  ADD COLUMN IF NOT EXISTS lowest_ask            NUMERIC,
  -- Seller's historical offer acceptance rate (0–100)
  ADD COLUMN IF NOT EXISTS offer_acceptance_rate NUMERIC,
  -- Number of users watching / favoriting this listing
  ADD COLUMN IF NOT EXISTS watchers_count        INT NOT NULL DEFAULT 0;

-- ── Offers: Week 1 required fields ───────────────────────────────────────────
ALTER TABLE public.offers
  -- Computed on insert: true when amount >= listing.competitive_range_min
  ADD COLUMN IF NOT EXISTS is_competitive BOOLEAN NOT NULL DEFAULT false,
  -- Timestamp updated when seller accepts or declines
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ;

-- ── Trigger: auto-set is_competitive on offer insert ─────────────────────────
CREATE OR REPLACE FUNCTION public.set_offer_is_competitive()
RETURNS TRIGGER AS $$
DECLARE
  v_min NUMERIC;
BEGIN
  SELECT competitive_range_min
    INTO v_min
    FROM public.listings
   WHERE id = NEW.listing_id;

  -- Mark competitive if min threshold is set and amount meets it
  IF v_min IS NOT NULL AND NEW.amount >= v_min THEN
    NEW.is_competitive := true;
  ELSE
    NEW.is_competitive := false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_offer_is_competitive ON public.offers;
CREATE TRIGGER trg_offer_is_competitive
  BEFORE INSERT ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.set_offer_is_competitive();

-- ── Trigger: auto-set updated_at on offer update ─────────────────────────────
CREATE OR REPLACE FUNCTION public.set_offer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_offer_updated_at ON public.offers;
CREATE TRIGGER trg_offer_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.set_offer_updated_at();

-- ── Trigger: keep watchers_count in sync with favorites ──────────────────────
CREATE OR REPLACE FUNCTION public.update_listing_watchers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.listings
       SET watchers_count = watchers_count + 1
     WHERE id = NEW.listing_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.listings
       SET watchers_count = GREATEST(watchers_count - 1, 0)
     WHERE id = OLD.listing_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_listing_watchers ON public.favorites;
CREATE TRIGGER trg_listing_watchers
  AFTER INSERT OR DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_listing_watchers_count();
