"use client";
import CubeLoader from "@/components/loader/cubeLoader";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This version prevents showing "Sign in with keycloak" or the default NextAuth fallback page.
// It only triggers signIn once the session status is "unauthenticated".

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Wait for session status to not be "loading" before taking any action
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      // Already authenticated, redirect to dashboard
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      // Only trigger signIn if definitely unauthenticated, and do it ONCE
      const callbackUrl = window.location.pathname + window.location.search;
      signIn("keycloak", { callbackUrl });
    }
    // Do nothing while loading
  }, [router, session, status]);

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div>
          {/* {children} */}
          <CubeLoader />
        </div>
      </div>
    </>
  );
}
