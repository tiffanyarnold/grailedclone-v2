"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import CollectionGrid from "@/components/home/CollectionGrid";
import EditorialSection from "@/components/home/EditorialSection";
import SecondaryCollections from "@/components/home/SecondaryCollections";
import EditorialSectionReversed from "@/components/home/EditorialSectionReversed";
import EditorialSectionTwo from "@/components/home/EditorialSectionTwo";
import ShopByCategory from "@/components/home/ShopByCategory";
import DailyPicks from "@/components/home/DailyPicks";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main>
        <HeroCarousel />
        <DailyPicks />
        <CollectionGrid />
        <EditorialSection />
        <SecondaryCollections />
        <EditorialSectionReversed />
        <EditorialSectionTwo />
        <ShopByCategory />
      </main>
      <Footer />
    </div>
  );
}
