-- Rename columns in listings table
ALTER TABLE public.listings RENAME COLUMN price TO listed_price;
ALTER TABLE public.listings RENAME COLUMN images TO image_url;
