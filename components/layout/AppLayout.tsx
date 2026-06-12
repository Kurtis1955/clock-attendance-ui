"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Header } from "./Header"
import { LayoutProvider, useLayout } from "./layout-context"
import { MobileSidebar, Sidebar } from "./Sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { collapsed } = useLayout()

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <MobileSidebar />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin] duration-300 ease-in-out",
          collapsed ? "lg:ml-20" : "lg:ml-[280px]"
        )}
      >
        <Header />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <LayoutProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </LayoutProvider>
  )
}
