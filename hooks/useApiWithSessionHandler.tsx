"use client";

import { useCallback, useRef } from "react";
import { getSession } from "next-auth/react";
import { useSessionExpired } from "@/contexts/SessionExpiredContext";
import {
  SESSION_EXPIRED_ERROR_MESSAGE,
  shouldTriggerSessionExpired,
} from "@/lib/session-expiration";

interface FetchOptions extends RequestInit {
  skipAuthHandling?: boolean;
}

export function useApiWithSessionHandler() {
  const { showSessionExpired } = useSessionExpired();
  const isHandlingSessionExpired = useRef(false);

  const fetchWithAuth = useCallback(
    async (url: string, options: FetchOptions = {}) => {
      const { skipAuthHandling = false, ...fetchOptions } = options;

      const doFetch = async () =>
        fetch(url, {
          ...fetchOptions,
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
          },
        });

      try {
        let response = await doFetch();

        if (!skipAuthHandling && (await shouldTriggerSessionExpired(response))) {
          const session = await getSession();

          if (session) {
            response = await doFetch();
          }

          if (response && !(await shouldTriggerSessionExpired(response))) {
            return response;
          }

          if (!isHandlingSessionExpired.current) {
            isHandlingSessionExpired.current = true;
            showSessionExpired();

            setTimeout(() => {
              isHandlingSessionExpired.current = false;
            }, 1000);
          }

          throw new Error(SESSION_EXPIRED_ERROR_MESSAGE);
        }

        return response;
      } catch (error) {
        if (error instanceof Error && error.message === SESSION_EXPIRED_ERROR_MESSAGE) {
          throw error;
        }
        throw error;
      }
    },
    [showSessionExpired]
  );

  return { fetchWithAuth };
}
