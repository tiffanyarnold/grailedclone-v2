"use client";

import React, { createContext, useContext, useState } from "react";
import { Listing, Offer, HeroSlide, Favorite, listings as initialListings, offers as initialOffers, heroSlides as initialHeroSlides, favorites as initialFavorites } from "@/lib/data";

interface StoreContextType {
  listings: Listing[];
  offers: Offer[];
  heroSlides: HeroSlide[];
  favorites: Favorite[];
  addListing: (listing: Listing) => void;
  updateListing: (id: string, data: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  addOffer: (offer: Offer) => void;
  updateOfferStatus: (id: string, status: "accepted" | "declined") => void;
  addHeroSlide: (slide: HeroSlide) => void;
  removeHeroSlide: (id: string) => void;
  updateHeroSlide: (id: string, data: Partial<HeroSlide>) => void;
  toggleFavorite: (userId: string, listingId: string) => void;
  isFavorited: (userId: string, listingId: string) => boolean;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialHeroSlides);
  const [favorites, setFavorites] = useState<Favorite[]>(initialFavorites);

  const addListing = (listing: Listing) => {
    setListings((prev) => [...prev, listing]);
  };

  const updateListing = (id: string, data: Partial<Listing>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const addOffer = (offer: Offer) => {
    setOffers((prev) => [...prev, offer]);
  };

  const updateOfferStatus = (id: string, status: "accepted" | "declined") => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const addHeroSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => [...prev, slide]);
  };

  const removeHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const updateHeroSlide = (id: string, data: Partial<HeroSlide>) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const toggleFavorite = (userId: string, listingId: string) => {
    const exists = favorites.find((f) => f.user_id === userId && f.listing_id === listingId);
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.id !== exists.id));
    } else {
      setFavorites((prev) => [...prev, { id: `fav-${Date.now()}`, user_id: userId, listing_id: listingId }]);
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
