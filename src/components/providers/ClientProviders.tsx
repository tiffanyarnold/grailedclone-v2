"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth-context";
import { StoreProvider } from "@/lib/store-context";
import LoginModal from "@/components/auth/LoginModal";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        {children}
        <LoginModal />
      </StoreProvider>
    </AuthProvider>
  );
}
