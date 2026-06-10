"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const handleReseed = async () => {
    setSeeding(true);
    setSeedResult(null);
    const { data, error } = await supabase.functions.invoke("supabase-functions-seed-data", {});
    setSeeding(false);
    if (error) {
      setSeedResult(`Error: ${error.message}`);
    } else {
      setSeedResult(data?.message ?? "Done");
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Settings</h1>

      <div className="bg-white border border-[#E8E8E8] p-6 max-w-[600px] mb-6">
        <h2 className="text-sm font-bold mb-4">Platform Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Site Name</label>
            <input
              defaultValue="GRAILED"
              className="w-full px-3 py-2 border border-gray-300 text-sm outline-none bg-gray-50"
              disabled
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Competitive Offer Threshold</label>
            <div className="flex items-center gap-2">
              <input
                defaultValue="85"
                className="w-20 px-3 py-2 border border-gray-300 text-sm outline-none bg-gray-50"
                disabled
              />
              <span className="text-xs text-gray-500">% of listing price</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Hero Carousel Auto-advance</label>
            <div className="flex items-center gap-2">
              <input
                defaultValue="5"
                className="w-20 px-3 py-2 border border-gray-300 text-sm outline-none bg-gray-50"
                disabled
              />
              <span className="text-xs text-gray-500">seconds</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400">Settings are read-only in demo mode.</p>
      </div>

      <div className="bg-white border border-[#E8E8E8] p-6 max-w-[600px]">
        <h2 className="text-sm font-bold mb-1">Demo Data</h2>
        <p className="text-xs text-gray-500 mb-4">
          Re-seed the database with demo users, listings, hero slides, offers, and favorites.
          If data already exists, this will only create missing users.
        </p>
        <button
          onClick={handleReseed}
          disabled={seeding}
          className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold tracking-wide hover:bg-black transition-colors disabled:opacity-50"
        >
          {seeding ? "SEEDING..." : "RE-SEED DATABASE"}
        </button>
        {seedResult && (
          <p className="mt-3 text-xs text-gray-600">{seedResult}</p>
        )}
      </div>
    </div>
  );
}
