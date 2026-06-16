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
  children?: NavigationItem[]
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
    // children: [
    //   {
    //     label: "View Users",
    //     href: "/users/view",
    //     icon: RiUserLine,
    //   },
    //   {
    //     label: "Create & Edit Users",
    //     href: "/users/manage",
    //     icon: RiUserLine,
    //   },
    // ],
  },
  {
    label: "Roles & Permissions",
    href: "/roles",
    icon: RiShieldKeyholeLine,
    // children: [
    //   {
    //     label: "View Roles",
    //     href: "/roles/view",
    //     icon: RiShieldKeyholeLine,
    //   },
    //   {
    //     label: "Create & Edit Roles",
    //     href: "/roles/manage",
    //     icon: RiShieldKeyholeLine,
    //   },
    // ],
  },
  {
    label: "Devices",
    href: "/devices",
    icon: RiRouterLine,
    children: [
      {
        label: "View Devices",
        href: "/devices/view",
        icon: RiRouterLine,
      },
      {
        label: "Manage Devices",
        href: "/devices/manage",
        icon: RiRouterLine,
      },
    ],
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
    // children: [
    //   {
    //     label: "View Attendance",
    //     href: "/attendance/view",
    //     icon: RiCalendarCheckLine,
    //   },
    //   {
    //     label: "Edit Attendance",
    //     href: "/attendance/manage",
    //     icon: RiCalendarCheckLine,
    //   },
    // ],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: RiBarChartBoxLine,
    children: [
      {
        label: "View Reports",
        href: "/reports/view",
        icon: RiBarChartBoxLine,
      },
      {
        label: "Export Reports",
        href: "/reports/export",
        icon: RiBarChartBoxLine,
      },
    ],
  },
]

export function getNavigationItemPermissionValues(
  item: NavigationItem,
): string[] {
  return [
    item.href,
    ...(item.children?.flatMap((child) =>
      getNavigationItemPermissionValues(child),
    ) ?? []),
  ]
}

export function getAllNavigationPermissionValues(
  items = navigationItems,
): string[] {
  return items.flatMap((item) => getNavigationItemPermissionValues(item))
}

export function isNavigationActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}
