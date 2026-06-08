"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import CollectionGrid from "@/components/home/CollectionGrid";
import EditorialSection from "@/components/home/EditorialSection";
import ShopByCategory from "@/components/home/ShopByCategory";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main>
        <HeroCarousel />
        <CollectionGrid />
        <EditorialSection />
        <ShopByCategory />
      </main>
      <Footer />
    </div>
  );
}
