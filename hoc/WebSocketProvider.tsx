"use client";

import { useEffect } from "react";
import websocket from "@/services/websocket";

export default function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    websocket.connect();

    return () => {
      websocket.disconnect();
    };
  }, []);

  return <>{children}</>;
}