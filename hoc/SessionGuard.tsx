// // hoc/SessionGuard.tsx (simplified)
// "use client";

// import { ReactNode } from "react";

// export default function SessionGuard({ children }: { children: ReactNode }) {
//   // Just render children - middleware handles the redirects
//   return <>{children}</>;
// }

"use client";
import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useSessionExpired } from "@/contexts/SessionExpiredContext";

export default function SessionGuard({ children }: { children: ReactNode }) {
  const { data: session, status }: { data: any; status: any } = useSession();
  const { showSessionExpired } = useSessionExpired();

  const useToken = session?.accessToken;
  localStorage.setItem("useToken", useToken || "");

  useEffect(() => {
    // Handle unauthenticated state (redirect to login)
    if (status === "unauthenticated") {
      const callbackUrl = window.location.pathname + window.location.search;
      signIn("keycloak", { callbackUrl });
    }
    // Handle session expiration from token refresh error
    else if (
      status === "authenticated" &&
      session?.error === "RefreshAccessTokenError"
    ) {
      // Show the session expired modal instead of auto-redirecting
      showSessionExpired();
    }
  }, [status, session, showSessionExpired]);

  return <>{children}</>;
}
