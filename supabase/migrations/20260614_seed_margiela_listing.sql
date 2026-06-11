-- Insert Maison Margiela FW17 Playing Card Silk Blouse listing
-- Uses the first seller profile found in the database
DO $$
DECLARE
  v_seller_id UUID;
BEGIN
  -- Get the first seller ID
  SELECT id INTO v_seller_id
  FROM public.profiles
  WHERE role = 'seller'
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_seller_id IS NULL THEN
    RAISE NOTICE 'No seller profile found. Skipping listing insert.';
    RETURN;
  END IF;

  -- Insert the Maison Margiela FW17 listing if it doesn't already exist
  IF NOT EXISTS (
    SELECT 1 FROM public.listings
    WHERE title = 'Maison Margiela FW17 Playing Card Silk Blouse'
  ) THEN
    INSERT INTO public.listings (
      seller_id,
      title,
      brand,
      description,
      category,
      size,
      condition,
      listed_price,
      image_url,
      created_at
    ) VALUES (
      v_seller_id,
      'Maison Margiela FW17 Playing Card Silk Blouse',
      'Maison Margiela',
      'Maison Margiela FW17 Playing Card Silk Blouse. Rare piece from the iconic Fall/Winter 2017 collection featuring a stunning playing card graphic print on luxurious silk. A true collector''s grail. Size IT 38. Excellent condition with minimal wear.',
      'Tops',
      'IT 38',
      'Gently Used',
      780,
      ARRAY[
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'
      ],
      NOW()
    );
    RAISE NOTICE 'Inserted Maison Margiela FW17 Playing Card Silk Blouse';
  ELSE
    RAISE NOTICE 'Maison Margiela FW17 Playing Card Silk Blouse already exists. Skipping.';
  END IF;
END $$;
