import { authOptions } from "@/utils/security";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Try to get the session with authOptions
  const session = await getServerSession(authOptions);

  // If the user is already authenticated, redirect to dashboard
  if (session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Try to get the callbackUrl from search params, fallback to /dashboard
  const searchParams = request.nextUrl?.searchParams;
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

  // Build the Keycloak sign-in URL
  const signInUrl = new URL("/api/auth/signin/keycloak", request.url);
  signInUrl.searchParams.set("callbackUrl", callbackUrl);

  // Redirect to Keycloak sign-in through NextAuth
  return NextResponse.redirect(signInUrl);
}
