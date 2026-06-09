"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth-context";
import { StoreProvider } from "@/lib/store-context";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        {children}
      </StoreProvider>
    </AuthProvider>
  );
}
