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
    const { data } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (data) setListings(data as Listing[]);
  };

  const fetchOffers = async () => {
    const { data } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
    if (data) setOffers(data as Offer[]);
  };

  const fetchHeroSlides = async () => {
    const { data } = await supabase.from("hero_slides").select("*").order("position");
    if (data) setHeroSlides(data as HeroSlide[]);
  };

  const fetchFavorites = async () => {
    const { data } = await supabase.from("favorites").select("*");
    if (data) setFavorites(data as Favorite[]);
  };

  const refreshData = useCallback(async () => {
    await Promise.all([fetchListings(), fetchOffers(), fetchHeroSlides(), fetchFavorites()]);
  }, []);

  useEffect(() => {
    refreshData().finally(() => setIsLoading(false));
  }, [refreshData]);

  const addListing = async (listing: Omit<Listing, "id" | "created_at">) => {
    const { data, error } = await supabase.from("listings").insert(listing).select().single();
    if (!error && data) setListings((prev) => [data as Listing, ...prev]);
  };

  const updateListing = async (id: string, data: Partial<Listing>) => {
    const { error } = await supabase.from("listings").update(data).eq("id", id);
    if (!error) setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (!error) setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const addOffer = async (offer: Omit<Offer, "id" | "created_at">) => {
    const { data, error } = await supabase.from("offers").insert(offer).select().single();
    if (!error && data) setOffers((prev) => [data as Offer, ...prev]);
  };

  const updateOfferStatus = async (id: string, status: "accepted" | "declined") => {
    const { error } = await supabase.from("offers").update({ status }).eq("id", id);
    if (!error) setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const addHeroSlide = async (slide: Omit<HeroSlide, "id">) => {
    const { data, error } = await supabase.from("hero_slides").insert(slide).select().single();
    if (!error && data) setHeroSlides((prev) => [...prev, data as HeroSlide]);
  };

  const removeHeroSlide = async (id: string) => {
    const { error } = await supabase.from("hero_slides").delete().eq("id", id);
    if (!error) setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const updateHeroSlide = async (id: string, data: Partial<HeroSlide>) => {
    const { error } = await supabase.from("hero_slides").update(data).eq("id", id);
    if (!error) setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const toggleFavorite = async (userId: string, listingId: string) => {
    const exists = favorites.find((f) => f.user_id === userId && f.listing_id === listingId);
    if (exists) {
      const { error } = await supabase.from("favorites").delete().eq("id", exists.id);
      if (!error) setFavorites((prev) => prev.filter((f) => f.id !== exists.id));
    } else {
      const { data, error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, listing_id: listingId })
        .select()
        .single();
      if (!error && data) setFavorites((prev) => [...prev, data as Favorite]);
    }
  };

  const isFavorited = (userId: string, listingId: string) => {
    return favorites.some((f) => f.user_id === userId && f.listing_id === listingId);
  };

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
