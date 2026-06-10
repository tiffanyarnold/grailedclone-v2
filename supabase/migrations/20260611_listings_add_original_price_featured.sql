-- Add original_price (for showing discount) and featured (show on home page) to listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS original_price NUMERIC,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
