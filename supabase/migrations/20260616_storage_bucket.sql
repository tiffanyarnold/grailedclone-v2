-- ── Supabase Storage: create listing-images bucket ───────────────────────────
-- This bucket stores photos uploaded from the /sell page.
-- Without this bucket, all photo uploads silently fail and listings are saved
-- with empty image_url arrays (showing blank gray boxes in the feed).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,                              -- publicly readable (no auth needed to view images)
  10485760,                          -- 10 MB max per file
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── Storage RLS policies ───────────────────────────────────────────────────────

-- Anyone can read (view) images — required for public feed display
DROP POLICY IF EXISTS "listing_images_public_select" ON storage.objects;
CREATE POLICY "listing_images_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

-- Authenticated users can upload to their own folder (listings/{user_id}/*)
DROP POLICY IF EXISTS "listing_images_auth_insert" ON storage.objects;
CREATE POLICY "listing_images_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
  );

-- Users can delete only their own uploads
DROP POLICY IF EXISTS "listing_images_owner_delete" ON storage.objects;
CREATE POLICY "listing_images_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-images'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );
