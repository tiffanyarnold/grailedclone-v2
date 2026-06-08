"use client";

export default function AdminSettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Settings</h1>

      <div className="bg-white border border-[#E8E8E8] p-6 max-w-[600px]">
        <h2 className="text-sm font-bold mb-4">Platform Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Site Name</label>
            <input
              defaultValue="GRAILED"
              className="w-full px-3 py-2 border border-gray-300 text-sm outline-none"
              disabled
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wide font-medium text-gray-500 mb-1">Competitive Offer Threshold</label>
            <div className="flex items-center gap-2">
              <input
                defaultValue="85"
                className="w-20 px-3 py-2 border border-gray-300 text-sm outline-none"
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
                className="w-20 px-3 py-2 border border-gray-300 text-sm outline-none"
                disabled
              />
              <span className="text-xs text-gray-500">seconds</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400">Settings are read-only in demo mode.</p>
      </div>
    </div>
  );
}
