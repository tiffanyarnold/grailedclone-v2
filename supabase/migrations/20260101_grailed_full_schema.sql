CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin', 'seller', 'buyer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  condition TEXT NOT NULL,
  listed_price NUMERIC NOT NULL,
  original_price NUMERIC,
  featured BOOLEAN NOT NULL DEFAULT false,
  -- Week 1
  min_offer_price NUMERIC,
  -- Week 2
  competitive_range_min NUMERIC,
  competitive_range_max NUMERIC,
  last_sold_price NUMERIC,
  lowest_ask NUMERIC,
  offer_acceptance_rate NUMERIC,
  watchers_count INT NOT NULL DEFAULT 0,
  image_url TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  is_competitive BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL DEFAULT '',
  button_text TEXT NOT NULL DEFAULT 'SHOP NOW',
  position INT NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-set is_competitive on offer insert
CREATE OR REPLACE FUNCTION public.set_offer_is_competitive()
RETURNS TRIGGER AS $$
DECLARE v_min NUMERIC;
BEGIN
  SELECT competitive_range_min INTO v_min FROM public.listings WHERE id = NEW.listing_id;
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

-- Auto-set updated_at on offer update
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

-- Sync watchers_count with favorites inserts/deletes
CREATE OR REPLACE FUNCTION public.update_listing_watchers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.listings SET watchers_count = watchers_count + 1 WHERE id = NEW.listing_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.listings SET watchers_count = GREATEST(watchers_count - 1, 0) WHERE id = OLD.listing_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_listing_watchers ON public.favorites;
CREATE TRIGGER trg_listing_watchers
  AFTER INSERT OR DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_listing_watchers_count();
