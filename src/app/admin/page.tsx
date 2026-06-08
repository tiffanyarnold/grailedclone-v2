"use client";

import { useStore } from "@/lib/store-context";
import { users } from "@/lib/data";
import { Package, Tag, Users, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const { listings, offers, heroSlides } = useStore();

  const stats = [
    { label: "Total Listings", value: listings.length, icon: Package },
    { label: "Total Offers", value: offers.length, icon: Tag },
    { label: "Active Hero Slides", value: heroSlides.filter((s) => s.active).length, icon: TrendingUp },
    { label: "Total Users", value: users.length, icon: Users },
  ];

  const recentOffers = offers.slice(-5).reverse();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-[#E8E8E8] p-5">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Offers */}
      <div className="bg-white border border-[#E8E8E8] p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide mb-4">Recent Offers</h2>
        <div className="space-y-3">
          {recentOffers.map((offer) => {
            const listing = listings.find((l) => l.id === offer.listing_id);
            const competitive = listing ? offer.amount >= listing.price * 0.85 : false;
            return (
              <div key={offer.id} className="flex items-center justify-between py-2 border-b border-[#F0F0F0] last:border-0">
                <div>
                  <p className="text-sm font-medium">{listing?.title || "Unknown"}</p>
                  <p className="text-xs text-gray-500">${offer.amount.toLocaleString()} offer</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-sm ${
                      competitive ? "bg-green-100 text-[#16A34A]" : "bg-red-100 text-[#DC2626]"
                    }`}
                  >
                    {competitive ? "Competitive" : "Low"}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                      offer.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : offer.status === "declined"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
