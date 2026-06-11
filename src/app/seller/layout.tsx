"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, openLoginModal } = useAuth();

  // Once auth resolves and there's no user, open the login modal in place.
  // We don't redirect to /login because auth is modal-only — there is no /login page.
  React.useEffect(() => {
    if (!isLoading && !user) {
      openLoginModal("login");
    }
  }, [user, isLoading, openLoginModal]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
