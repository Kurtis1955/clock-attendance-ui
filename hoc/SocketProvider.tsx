// providers/SocketProvider.tsx
"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import socketService from "@/services/websocket";

const SocketContext = createContext(socketService);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const connected = useRef(false);
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    if (connected.current) return;

    connected.current = true;
    socketService.connect(token);

    return () => {
      connected.current = false;
      socketService.disconnect();
    };
  }, [status, token]); // <-- depend on the primitive token string, not the session object

  return (
    <SocketContext.Provider value={socketService}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);