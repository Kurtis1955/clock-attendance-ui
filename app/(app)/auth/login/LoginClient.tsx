// app/(app)/auth/login/LoginClient.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginClient() {
  const searchParams = useSearchParams();
  console.log("Search Params:", searchParams.toString());
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    // Redirect to Keycloak sign-in
    window.location.href = `/api/auth/signin/keycloak?callbackUrl=${encodeURIComponent(
      callbackUrl
    )}`;
  }, [callbackUrl]);

  return null;
}