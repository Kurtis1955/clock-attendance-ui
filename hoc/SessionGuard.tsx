/* eslint-disable */
"use client";
import { PERSIST_STORE_NAME } from "@/constants/app.constant";
import BaseService from "@/services/ApiBaseService";
// import { decryptToken } from "@/utils/helpers";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function SessionGuard({ children }: { children: ReactNode }) {
  const { data: session, status }: { data: any; status: any } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Handle unauthenticated state (redirect to login)
    if (status === "unauthenticated") {
      signIn("keycloak"); // Redirect straight to Keycloak
    }
    else if (
      status === "authenticated" &&
      session?.error === "RefreshAccessTokenError"
    ) {
      // alert("refresh token error..loging out");
      signOut({
        redirect: false, // Prevents the automatic redirect
      }).then(() => {
        signIn("keycloak"); // Redirect to Keycloak login after signing out
      });
    }
  }, [status, session, router]);

  return <>{children}</>;
}
