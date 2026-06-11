-- Enable Supabase Realtime for listings and offers tables
-- This allows the frontend to subscribe to live changes across browser sessions
-- (buyer makes offer → seller sees it instantly; new listings appear without refresh)

-- Add listings table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;

-- Add offers table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;
