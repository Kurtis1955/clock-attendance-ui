'use client'

import dynamic from "next/dynamic"
import { ReactNode } from "react"
import { SessionExpiredProvider } from "@/contexts/SessionExpiredContext"
import { SocketProvider } from "./SocketProvider"

const SessionProvider = dynamic(
  () => import("next-auth/react").then((mod) => mod.SessionProvider),
  { ssr: false }
)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={4 * 60}>
      <SessionExpiredProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </SessionExpiredProvider>
    </SessionProvider>
  )
}