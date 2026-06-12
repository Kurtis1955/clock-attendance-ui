import type { IconType } from "react-icons"
import {
  RiBarChartBoxLine,
  RiCalendarCheckLine,
  RiDashboardLine,
  RiFingerprintLine,
  RiPlugLine,
  RiRouterLine,
  RiSettings3Line,
  RiShieldKeyholeLine,
  RiUserLine,
} from "react-icons/ri"

export interface NavigationItem {
  label: string
  href: string
  icon: IconType
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: RiDashboardLine,
  },
  {
    label: "Users",
    href: "/users",
    icon: RiUserLine,
  },
  {
    label: "Roles & Permissions",
    href: "/roles",
    icon: RiShieldKeyholeLine,
  },
  {
    label: "Devices",
    href: "/devices",
    icon: RiRouterLine,
  },
  {
    label: "Biometric Enrollment",
    href: "/enrollment",
    icon: RiFingerprintLine,
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: RiCalendarCheckLine,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: RiBarChartBoxLine,
  },
  // {
  //   label: "ERP Integration",
  //   href: "/integrations",
  //   icon: RiPlugLine,
  // },
  // {
  //   label: "Settings",
  //   href: "/settings",
  //   icon: RiSettings3Line,
  // },
]

export function isNavigationActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}
