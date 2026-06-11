"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  brand: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  listed_price: number;
  sale_price?: number | null;
  discount?: number | null;
  original_price?: number | null;
  featured?: boolean;
  // Week 1
  min_offer_price?: number | null;
  // Week 2
  competitive_range_min?: number | null;
  competitive_range_max?: number | null;
  last_sold_price?: number | null;
  lowest_ask?: number | null;
  offer_acceptance_rate?: number | null;
  watchers_count?: number;
  created_at: string;
  image_url: string[];
}

export interface Offer {
  id: string;
  listing_id: string;
  buyer_id: string;
  amount: number;
  status: "pending" | "accepted" | "declined";
  is_competitive?: boolean;
  updated_at?: string | null;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  listing_id: string;
  headline: string;
  subheadline: string;
  button_text: string;
  position: number;
  active: boolean;
  image: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
}

interface StoreContextType {
  listings: Listing[];
  offers: Offer[];
  heroSlides: HeroSlide[];
  favorites: Favorite[];
  isLoading: boolean;
  addListing: (listing: Omit<Listing, "id" | "created_at">) => Promise<void>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  addOffer: (offer: Omit<Offer, "id" | "created_at">) => Promise<void>;
  updateOfferStatus: (id: string, status: "accepted" | "declined") => Promise<void>;
  addHeroSlide: (slide: Omit<HeroSlide, "id">) => Promise<void>;
  removeHeroSlide: (id: string) => Promise<void>;
  updateHeroSlide: (id: string, data: Partial<HeroSlide>) => Promise<void>;
  toggleFavorite: (userId: string, listingId: string) => Promise<void>;
  isFavorited: (userId: string, listingId: string) => boolean;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("fetchListings error:", error.message);
    if (data) setListings(data as Listing[]);
  };

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("fetchOffers error:", error.message);
    if (data) setOffers(data as Offer[]);
  };

  const fetchHeroSlides = async () => {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("position");
    if (error) console.error("fetchHeroSlides error:", error.message);
    if (data) setHeroSlides(data as HeroSlide[]);
  };

  const fetchFavorites = async () => {
    const { data, error } = await supabase.from("favorites").select("*");
    if (error) console.error("fetchFavorites error:", error.message);
    if (data) setFavorites(data as Favorite[]);
  };

  const refreshData = useCallback(async () => {
    await Promise.all([fetchListings(), fetchOffers(), fetchHeroSlides(), fetchFavorites()]);
  }, []);

  // ── Initial data load ────────────────────────────────────────────────────
  useEffect(() => {
    refreshData().finally(() => setIsLoading(false));
  }, [refreshData]);

  // ── Re-fetch auth-gated tables when session changes ──────────────────────
  // The initial load fires before the Supabase session is ready, so offers
  // and favorites (protected by RLS) come back empty on the first fetch.
  // We re-fetch them once the session is confirmed, and clear them on logout.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchOffers();
        fetchFavorites();
      } else if (event === "SIGNED_OUT") {
        setOffers([]);
        setFavorites([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Real-time subscriptions ──────────────────────────────────────────────
  // Streams live INSERT/UPDATE/DELETE to all connected sessions so a buyer's
  // offer appears on the seller's dashboard without a page refresh.
  useEffect(() => {
    const listingsChannel = supabase
      .channel("realtime-listings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "listings" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setListings((prev) => {
              if (prev.some((l) => l.id === (payload.new as Listing).id)) return prev;
              return [payload.new as Listing, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            setListings((prev) =>
              prev.map((l) =>
                l.id === (payload.new as Listing).id ? (payload.new as Listing) : l
              )
            );
          } else if (payload.eventType === "DELETE") {
            setListings((prev) =>
              prev.filter((l) => l.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    const offersChannel = supabase
      .channel("realtime-offers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "offers" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOffers((prev) => {
              if (prev.some((o) => o.id === (payload.new as Offer).id)) return prev;
              return [payload.new as Offer, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            setOffers((prev) =>
              prev.map((o) =>
                o.id === (payload.new as Offer).id ? (payload.new as Offer) : o
              )
            );
          } else if (payload.eventType === "DELETE") {
            setOffers((prev) =>
              prev.filter((o) => o.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(listingsChannel);
      supabase.removeChannel(offersChannel);
    };
  }, []);

  // ── Mutations ────────────────────────────────────────────────────────────
  // Every mutation THROWS on Supabase error so callers (sell page, offer
  // modal, dashboard) can catch it and show the user a real error message
  // instead of silently failing and leaving state inconsistent.

  const addListing = async (listing: Omit<Listing, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("listings")
      .insert(listing)
      .select()
      .single();
    if (error) throw new Error(error.message);
    // Optimistic local update — realtime subscription may also fire; the
    // duplicate guard below prevents the listing appearing twice.
    setListings((prev) => {
      if (prev.some((l) => l.id === (data as Listing).id)) return prev;
      return [data as Listing, ...prev];
    });
  };

  const updateListing = async (id: string, data: Partial<Listing>) => {
    const { error } = await supabase.from("listings").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const addOffer = async (offer: Omit<Offer, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("offers")
      .insert(offer)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setOffers((prev) => {
      if (prev.some((o) => o.id === (data as Offer).id)) return prev;
      return [data as Offer, ...prev];
    });
  };

  const updateOfferStatus = async (id: string, status: "accepted" | "declined") => {
    const { error } = await supabase.from("offers").update({ status }).eq("id", id);
    if (error) throw new Error(error.message);
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const addHeroSlide = async (slide: Omit<HeroSlide, "id">) => {
    const { data, error } = await supabase
      .from("hero_slides")
      .insert(slide)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setHeroSlides((prev) => [...prev, data as HeroSlide]);
  };

  const removeHeroSlide = async (id: string) => {
    const { error } = await supabase.from("hero_slides").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const updateHeroSlide = async (id: string, data: Partial<HeroSlide>) => {
    const { error } = await supabase.from("hero_slides").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    setHeroSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const toggleFavorite = async (userId: string, listingId: string) => {
    const exists = favorites.find(
      (f) => f.user_id === userId && f.listing_id === listingId
    );
    if (exists) {
      const { error } = await supabase.from("favorites").delete().eq("id", exists.id);
      if (error) throw new Error(error.message);
      setFavorites((prev) => prev.filter((f) => f.id !== exists.id));
    } else {
      const { data, error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, listing_id: listingId })
        .select()
        .single();
      if (error) throw new Error(error.message);
      setFavorites((prev) => [...prev, data as Favorite]);
    }
  };

  const isFavorited = (userId: string, listingId: string) =>
    favorites.some((f) => f.user_id === userId && f.listing_id === listingId);

  return (
    <StoreContext.Provider
      value={{
        listings,
        offers,
        heroSlides,
        favorites,
        isLoading,
        addListing,
        updateListing,
        deleteListing,
        addOffer,
        updateOfferStatus,
        addHeroSlide,
        removeHeroSlide,
        updateHeroSlide,
        toggleFavorite,
        isFavorited,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
