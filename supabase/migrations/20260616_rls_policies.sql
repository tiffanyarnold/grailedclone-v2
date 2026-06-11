-- ── Row Level Security: enable on all tables ─────────────────────────────────
-- Without RLS policies, Supabase's anon key cannot INSERT rows even when the
-- user is authenticated. This migration enables RLS and adds the minimum
-- policies required for the sell→feed flow to work end-to-end.

-- ── profiles ──────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"   ON public.profiles;

-- Anyone (including unauthenticated visitors) can read profiles
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

-- Only the Supabase trigger (SECURITY DEFINER) inserts profiles on signup.
-- Allow a user to insert their own row if it doesn't already exist (fallback).
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── listings ──────────────────────────────────────────────────────────────────
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "listings_select_all"      ON public.listings;
DROP POLICY IF EXISTS "listings_insert_seller"   ON public.listings;
DROP POLICY IF EXISTS "listings_update_seller"   ON public.listings;
DROP POLICY IF EXISTS "listings_delete_seller"   ON public.listings;

-- All listings are publicly visible (feed, browse, listing detail)
CREATE POLICY "listings_select_all"
  ON public.listings FOR SELECT
  USING (true);

-- Any authenticated user can create a listing (they become the seller)
CREATE POLICY "listings_insert_seller"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

-- Only the seller who owns the listing can update it
CREATE POLICY "listings_update_seller"
  ON public.listings FOR UPDATE
  USING (auth.uid() = seller_id);

-- Only the seller who owns the listing can delete it
CREATE POLICY "listings_delete_seller"
  ON public.listings FOR DELETE
  USING (auth.uid() = seller_id);

-- ── offers ────────────────────────────────────────────────────────────────────
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "offers_select_parties"    ON public.offers;
DROP POLICY IF EXISTS "offers_insert_buyer"      ON public.offers;
DROP POLICY IF EXISTS "offers_update_seller"     ON public.offers;

-- Buyer can see their own offers; seller can see offers on their listings
CREATE POLICY "offers_select_parties"
  ON public.offers FOR SELECT
  USING (
    auth.uid() = buyer_id
    OR auth.uid() IN (
      SELECT seller_id FROM public.listings WHERE id = listing_id
    )
  );

-- Any authenticated user can make an offer as a buyer
CREATE POLICY "offers_insert_buyer"
  ON public.offers FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Seller can accept/decline (update status) on offers for their listings
CREATE POLICY "offers_update_seller"
  ON public.offers FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT seller_id FROM public.listings WHERE id = listing_id
    )
  );

-- ── favorites ─────────────────────────────────────────────────────────────────
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_select_own"   ON public.favorites;
DROP POLICY IF EXISTS "favorites_insert_own"   ON public.favorites;
DROP POLICY IF EXISTS "favorites_delete_own"   ON public.favorites;

-- Users see only their own favorites
CREATE POLICY "favorites_select_own"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "favorites_insert_own"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "favorites_delete_own"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ── hero_slides ───────────────────────────────────────────────────────────────
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hero_slides_select_all"    ON public.hero_slides;
DROP POLICY IF EXISTS "hero_slides_admin_write"   ON public.hero_slides;

-- Hero slides are publicly visible
CREATE POLICY "hero_slides_select_all"
  ON public.hero_slides FOR SELECT
  USING (true);

-- Only admins can write hero slides
CREATE POLICY "hero_slides_admin_write"
  ON public.hero_slides FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );
