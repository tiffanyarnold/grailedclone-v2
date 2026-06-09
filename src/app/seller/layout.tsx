"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!user || (user.role !== "seller" && user.role !== "admin"))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-[#F7F7F7]" />;
  }

  if (user.role !== "seller" && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500 mb-4">You need seller privileges to access this page.</p>
          <Link href="/login" className="text-sm underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
