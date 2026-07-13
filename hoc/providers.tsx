'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { PermissionProvider } from "@/hoc/permissions-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={4 * 60}>
      <PermissionProvider>{children}</PermissionProvider>
    </SessionProvider>
  )
}