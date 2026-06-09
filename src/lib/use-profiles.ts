"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, name, email, role")
      .then(({ data }) => {
        if (data) setProfiles(data);
      });
  }, []);

  const getProfileById = (id: string): Profile | undefined => {
    return profiles.find((p) => p.id === id);
  };

  return { profiles, getProfileById };
}
