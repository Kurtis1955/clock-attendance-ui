import type { ComponentType } from "react"
import Link from "next/link"
import {
  RiBankCardLine,
  RiFingerprintLine,
  RiScan2Line,
} from "react-icons/ri"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  recentAttendanceRecords,
  type AttendanceMethod,
  type AttendanceStatus,
  type RecentAttendanceRecord,
} from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

const methodConfig: Record<
  AttendanceMethod,
  { label: string; icon: ComponentType<{ className?: string }> }
> = {
  face: { label: "Face Recognition", icon: RiScan2Line },
  fingerprint: { label: "Fingerprint", icon: RiFingerprintLine },
  rfid: { label: "RFID Card", icon: RiBankCardLine },
}

const statusConfig: Record<
  AttendanceStatus,
  { label: string; className: string }
> = {
  success: {
    label: "Success",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  denied: {
    label: "Denied",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  flagged: {
    label: "Flagged",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
}

function AttendanceRow({ record }: { record: RecentAttendanceRecord }) {
  const method = methodConfig[record.method]
  const status = statusConfig[record.status]
  const MethodIcon = method.icon

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-slate-200">
            <AvatarFallback className="bg-slate-100 text-xs font-semibold text-[#0f172a]">
              {record.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">
              {record.userName}
            </p>
            <p className="text-xs text-[#64748b]">{record.employeeId}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm font-medium text-[#0f172a]">{record.deviceName}</p>
        <p className="text-xs text-[#64748b]">{record.branch}</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-[#0f172a]">
          <MethodIcon className="size-4 text-[#64748b]" aria-hidden="true" />
          {method.label}
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-[#0f172a]">{record.timestamp}</td>
      <td className="px-4 py-4">
        <Badge
          className={cn(
            "rounded-md px-2.5 py-0.5 text-xs font-medium",
            status.className
          )}
        >
          {status.label}
        </Badge>
      </td>
    </tr>
  )
}

export function RecentAttendanceTable() {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold text-[#0f172a]">
          Recent Attendance Records
        </CardTitle>
        <Link
          href="/attendance"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          View All Records
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {[
                  "User",
                  "Device / Branch",
                  "Method",
                  "Timestamp",
                  "Status",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold tracking-wide text-[#64748b] uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAttendanceRecords.map((record) => (
                <AttendanceRow key={record.id} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
