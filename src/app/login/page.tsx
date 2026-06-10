"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openLoginModal, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") router.push("/admin");
      else if (user.role === "seller") router.push("/seller/dashboard");
      else router.push("/");
    } else {
      const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
      router.push("/");
      // Small delay to let the page render before opening modal
      setTimeout(() => openLoginModal(mode), 100);
    }
  }, [user, router, openLoginModal, searchParams]);

  return null;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginRedirect />
    </Suspense>
  );
}
