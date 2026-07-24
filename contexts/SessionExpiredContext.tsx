"use client";

import * as React from "react";
import { SessionExpiredModal } from "@/components/modals/SessionExpiredModal";
import {
  SESSION_EXPIRED_ERROR_MESSAGE,
  shouldTriggerSessionExpired,
} from "@/lib/session-expiration";

interface SessionExpiredContextType {
  showSessionExpired: () => void;
  hideSessionExpired: () => void;
  isSessionExpiredVisible: boolean;
}

const SessionExpiredContext = React.createContext<SessionExpiredContextType | null>(
  null
);

export function SessionExpiredProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const sessionExpiredHandledRef = React.useRef(false);

  const showSessionExpired = React.useCallback(() => {
    if (sessionExpiredHandledRef.current) {
      return;
    }

    sessionExpiredHandledRef.current = true;
    setIsOpen(true);
  }, []);

  const hideSessionExpired = React.useCallback(() => {
    sessionExpiredHandledRef.current = false;
    setIsOpen(false);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nativeFetch = window.fetch.bind(window);

    const isApiRequest = (input: RequestInfo | URL) => {
      const requestUrl =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      return (
        requestUrl.startsWith("/api") ||
        requestUrl.startsWith(`${window.location.origin}/api`) ||
        requestUrl.includes("/api/")
      );
    };

    const isAuthRequest = (input: RequestInfo | URL) => {
      const requestUrl =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      return requestUrl.includes("/api/auth");
    };

    const wrappedFetch: typeof window.fetch = async (input, init) => {
      if (!isApiRequest(input) || isAuthRequest(input)) {
        return nativeFetch(input, init);
      }

      if (sessionExpiredHandledRef.current) {
        throw new Error(SESSION_EXPIRED_ERROR_MESSAGE);
      }

      const response = await nativeFetch(input, init);

      if (response.status === 401 || response.status === 403) {
        showSessionExpired();
        throw new Error(SESSION_EXPIRED_ERROR_MESSAGE);
      }

      if (await shouldTriggerSessionExpired(response)) {
        showSessionExpired();
        throw new Error(SESSION_EXPIRED_ERROR_MESSAGE);
      }

      return response;
    };

    window.fetch = wrappedFetch;

    return () => {
      window.fetch = nativeFetch;
    };
  }, [showSessionExpired]);

  const value = React.useMemo(
    () => ({
      showSessionExpired,
      hideSessionExpired,
      isSessionExpiredVisible: isOpen,
    }),
    [showSessionExpired, hideSessionExpired, isOpen]
  );

  return (
    <SessionExpiredContext.Provider value={value}>
      {children}
      <SessionExpiredModal isOpen={isOpen} onClose={hideSessionExpired} />
    </SessionExpiredContext.Provider>
  );
}

export function useSessionExpired() {
  const context = React.useContext(SessionExpiredContext);
  if (!context) {
    throw new Error(
      "useSessionExpired must be used within a SessionExpiredProvider"
    );
  }
  return context;
}
