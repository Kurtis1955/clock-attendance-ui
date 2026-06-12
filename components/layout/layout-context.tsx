"use client"

import * as React from "react"

interface LayoutContextValue {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggleCollapsed: () => void
  toggleMobile: () => void
}

const LayoutContext = React.createContext<LayoutContextValue | null>(null)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  const toggleMobile = React.useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  const value = React.useMemo(
    () => ({
      collapsed,
      setCollapsed,
      mobileOpen,
      setMobileOpen,
      toggleCollapsed,
      toggleMobile,
    }),
    [collapsed, mobileOpen, toggleCollapsed, toggleMobile]
  )

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = React.useContext(LayoutContext)

  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }

  return context
}
