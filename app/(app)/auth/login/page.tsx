"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    // This page is now a simple wrapper that sends the user directly
    // to the Keycloak provider sign-in route with a clean callbackUrl.
    window.location.href = `/api/auth/signin/keycloak?callbackUrl=${encodeURIComponent(
      callbackUrl
    )}`;
  }, [callbackUrl]);

  return null;
}
