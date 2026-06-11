"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  transaction_count: number;
}

const fetchAllProfiles = async (set: (p: Profile[]) => void) => {
  const { data } = await supabase
    .from("profiles")
    .select("id, name, email, role, transaction_count");
  if (data) set(data as Profile[]);
};

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    // Initial fetch — profiles table is publicly readable so this works
    // even before auth resolves.
    fetchAllProfiles(setProfiles);

    // Re-fetch after login so the seller name on listing/[id] isn't stale.
    // The first fetch fires before the Supabase session is ready; a signed-in
    // user navigating directly to a listing would see "Unknown" as seller name
    // until a re-fetch happens.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchAllProfiles(setProfiles);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getProfileById = (id: string): Profile | undefined => {
    return profiles.find((p) => p.id === id);
  };

  return { profiles, getProfileById };
}
