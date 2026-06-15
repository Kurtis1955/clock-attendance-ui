import {
  RiShieldUserLine,
  RiUserFollowLine,
  RiUserLine,
  RiUserUnfollowLine,
} from "react-icons/ri"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { userStats } from "@/lib/users-data"

const stats = [
  {
    title: "Total Users",
    value: userStats.total.toLocaleString(),
    // change: `↑ ${userStats.growthPercent}% from last month`,
    changeColor: "text-green-600",
    icon: RiUserLine,
    iconColor: "text-purple-600 bg-purple-50",
  },
  {
    title: "Active Users",
    value: userStats.active.toLocaleString(),
    // change: `${userStats.activePercent}% of total users`,
    changeColor: "text-green-600",
    icon: RiUserFollowLine,
    iconColor: "text-green-600 bg-green-50",
  },
  {
    title: "Inactive Users",
    value: userStats.inactive.toLocaleString(),
    // change: `↓ ${userStats.inactivePercent}% of total users`,
    changeColor: "text-orange-600",
    icon: RiUserUnfollowLine,
    iconColor: "text-orange-600 bg-orange-50",
  },
  {
    title: "Admins",
    value: userStats.admins.toLocaleString(),
    // change: `↑ ${userStats.adminPercent}% of total users`,
    changeColor: "text-green-600",
    icon: RiShieldUserLine,
    iconColor: "text-blue-600 bg-blue-50",
  },
]

export function UserStatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className="border-slate-200 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b]">
                {stat.title}
              </CardTitle>
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${stat.iconColor}`}
              >
                <Icon className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight text-[#0f172a]">
                {stat.value}
              </p>
              {/* <p className={`mt-1 text-xs font-medium ${stat.changeColor}`}>
                {stat.change}
              </p> */}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
