-- Add transaction_count to profiles for seller block display
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS transaction_count INT NOT NULL DEFAULT 0;
