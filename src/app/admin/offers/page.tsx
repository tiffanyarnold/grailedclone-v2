"use client";

import { useStore } from "@/lib/store-context";
import { useProfiles } from "@/lib/use-profiles";

export default function AdminOffersPage() {
  const { offers, listings } = useStore();
  const { getProfileById } = useProfiles();

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">All Offers</h1>

      <div className="bg-white border border-[#E8E8E8] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E8E8]">
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Listing</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Buyer</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Seller</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Amount</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Strength</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Status</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => {
              const listing = listings.find((l) => l.id === offer.listing_id);
              const buyer = getProfileById(offer.buyer_id);
              const seller = listing ? getProfileById(listing.seller_id) : null;
              const competitive = listing ? offer.amount >= listing.listed_price * 0.85 : false;

              return (
                <tr key={offer.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA]">
                  <td className="px-4 py-3 text-xs">{listing?.title || "Unknown"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{buyer?.name || "Unknown"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{seller?.name || "Unknown"}</td>
                  <td className="px-4 py-3 text-xs font-medium">${offer.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-sm ${
                        competitive ? "bg-green-100 text-[#16A34A]" : "bg-red-100 text-[#DC2626]"
                      }`}
                    >
                      {competitive ? "Competitive" : "Low"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-sm capitalize ${
                        offer.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : offer.status === "declined"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(offer.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
