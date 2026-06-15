"use client";

import { useMemo, useState } from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiBarChartBoxLine,
  RiCalendarCheckLine,
  RiDownloadLine,
  RiEyeLine,
  RiFilter3Line,
  RiFingerprintLine,
  RiMore2Fill,
  RiRefreshLine,
  RiRouterLine,
  RiSearchLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type AttendanceStatus = "Present" | "Absent" | "On Duty" | "Remote";

interface AttendanceRecord {
  employeeId: string;
  name: string;
  team: string;
  branch: string;
  device: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: AttendanceStatus;
  method: string;
}

const records: AttendanceRecord[] = [
  {
    employeeId: "EMP-1001",
    name: "John Doe",
    team: "Operations",
    branch: "Head Office",
    device: "SpeedFace V5L",
    clockIn: "08:01 AM",
    clockOut: "05:01 PM",
    hours: "9h 00m",
    status: "Present",
    method: "Face",
  },
  {
    employeeId: "EMP-1002",
    name: "Mary Smith",
    team: "HR",
    branch: "Kumasi Branch",
    device: "K40 Terminal",
    clockIn: "08:05 AM",
    clockOut: "05:10 PM",
    hours: "9h 05m",
    status: "Present",
    method: "Fingerprint",
  },
  {
    employeeId: "EMP-1003",
    name: "Daniel Mensah",
    team: "Security",
    branch: "Head Office",
    device: "SpeedFace V5L",
    clockIn: "-",
    clockOut: "-",
    hours: "0h 00m",
    status: "Absent",
    method: "-",
  },
  {
    employeeId: "EMP-1004",
    name: "Kwame Asare",
    team: "Field Team",
    branch: "Takoradi Branch",
    device: "MB360",
    clockIn: "08:07 AM",
    clockOut: "-",
    hours: "6h 42m",
    status: "On Duty",
    method: "Face",
  },
  {
    employeeId: "EMP-1005",
    name: "Sarah Owusu",
    team: "Finance",
    branch: "Head Office",
    device: "U300",
    clockIn: "08:09 AM",
    clockOut: "05:02 PM",
    hours: "8h 53m",
    status: "Present",
    method: "Fingerprint",
  },
  {
    employeeId: "EMP-1006",
    name: "Ama Boateng",
    team: "Admin",
    branch: "Tema Branch",
    device: "Mobile App",
    clockIn: "08:14 AM",
    clockOut: "-",
    hours: "6h 35m",
    status: "Remote",
    method: "Mobile",
  },
];

const liveActivity = [
  {
    time: "08:01 AM",
    name: "John Doe",
    meta: "EMP-1001",
    device: "SpeedFace V5L",
    branch: "Head Office",
    action: "Check In",
  },
  {
    time: "08:05 AM",
    name: "Mary Smith",
    meta: "EMP-1002",
    device: "K40 Terminal",
    branch: "Kumasi Branch",
    action: "Check In",
  },
  {
    time: "08:09 AM",
    name: "Sarah Owusu",
    meta: "EMP-1005",
    device: "U300",
    branch: "Head Office",
    action: "Check In",
  },
  {
    time: "12:32 PM",
    name: "Kwame Asare",
    meta: "EMP-1004",
    device: "MB360",
    branch: "Takoradi Branch",
    action: "Break Out",
  },
  {
    time: "01:04 PM",
    name: "Ama Boateng",
    meta: "EMP-1006",
    device: "Mobile App",
    branch: "Tema Branch",
    action: "Break In",
  },
];

const branchCoverage = [
  { branch: "Head Office", present: 612, expected: 650, color: "bg-blue-600" },
  { branch: "Kumasi Branch", present: 318, expected: 340, color: "bg-green-500" },
  { branch: "Tema Branch", present: 274, expected: 302, color: "bg-amber-500" },
  { branch: "Takoradi Branch", present: 221, expected: 248, color: "bg-cyan-500" },
];

const statCards = [
  {
    title: "My Branch Coverage",
    value: "94.2%",
    caption: "612 of 650 checked in",
    trend: "+2.8% vs yesterday",
    icon: RiShieldCheckLine,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "On-Time Rate",
    value: "91.8%",
    caption: "Within shift grace period",
    trend: "+4.1% this week",
    icon: RiTimeLine,
    color: "bg-green-50 text-green-700",
  },
  {
    title: "Device Sync Health",
    value: "43/45",
    caption: "Devices synced in 5 mins",
    trend: "Last sync 58s ago",
    icon: RiRouterLine,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Approval Queue",
    value: "18",
    caption: "Manual edits awaiting review",
    trend: "6 high priority",
    trendColor: "text-amber-600",
    icon: RiFingerprintLine,
    color: "bg-amber-50 text-amber-700",
  },
];

const statusStyles: Record<AttendanceStatus, string> = {
  Present: "bg-green-50 text-green-700",
  Absent: "bg-red-50 text-red-700",
  "On Duty": "bg-blue-50 text-blue-700",
  Remote: "bg-purple-50 text-purple-700",
};

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.device.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch =
        branchFilter === "all" || record.branch === branchFilter;
      const matchesStatus =
        statusFilter === "all" ||
        record.status.toLowerCase().replace(" ", "-") === statusFilter;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [branchFilter, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col gap-5 px-2 pt-2 lg:px-8">
      <PageHeader
        title="Attendance Command Center"
        description="Monitor workforce coverage, device sync health, and verified clocking activity across branches."
        actions={
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 md:flex md:justify-end">
            <Button variant="outline" className="border-slate-200 bg-white">
              <RiDownloadLine className="size-4 text-blue-700" />
              Export
            </Button>
            <Button variant="outline" className="border-slate-200 bg-white">
              <RiBarChartBoxLine className="size-4 text-blue-700" />
              Report
            </Button>
            <Button className="bg-blue-700 text-white hover:bg-blue-800">
              <RiRefreshLine className="size-4" />
              Sync Records
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className="border-slate-200 shadow-sm">
              <CardContent className="flex items-center gap-4">
                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="size-7" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0f172a]">
                    {stat.title}
                  </p>
                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-2xl font-bold text-[#0f172a]">
                      {stat.value}
                    </p>
                    <span
                      className={`pb-1 text-xs font-semibold ${stat.trendColor ?? "text-green-600"}`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-sm text-[#475569]">{stat.caption}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Live Clock Stream</CardTitle>
              <span className="flex items-center gap-2 text-sm font-medium text-green-700">
                <span className="size-2 rounded-full bg-green-500" />
                Live
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {liveActivity.map((activity) => (
              <div
                key={`${activity.time}-${activity.name}`}
                className="grid gap-3 border-b border-slate-100 py-3 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_minmax(120px,0.7fr)_auto]"
              >
                <span className="text-sm font-medium text-slate-500">
                  {activity.time}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-[#0f172a]">{activity.name}</p>
                  <p className="text-xs text-slate-500">{activity.meta}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#0f172a]">
                    {activity.device}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {activity.branch}
                  </p>
                </div>
                <Badge className="self-center bg-green-50 text-green-700">
                  {activity.action}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle>Branch Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600">
                    Network Attendance
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[#0f172a]">
                    92.6%
                  </p>
                </div>
                <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <RiCalendarCheckLine className="size-8" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                1,425 checked in across 1,540 expected staff.
              </p>
            </div>

            <div className="space-y-4">
              {branchCoverage.map((item) => {
                const percent = Math.round((item.present / item.expected) * 100);

                return (
                  <div key={item.branch} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#0f172a]">
                        {item.branch}
                      </span>
                      <span className="text-slate-500">
                        {item.present}/{item.expected} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Attendance Records</CardTitle>
            <span className="text-sm text-slate-500">
              Today, Jun 15, 2026
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Input
                type="search"
                placeholder="Search by name, employee ID, or device..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-10 pr-10"
              />
              <RiSearchLine className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
            </div>
            <select
              value={branchFilter}
              onChange={(event) => setBranchFilter(event.target.value)}
              className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-44"
            >
              <option value="all">All Branches</option>
              {branchCoverage.map((item) => (
                <option key={item.branch} value={item.branch}>
                  {item.branch}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-36"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="on-duty">On Duty</option>
              <option value="remote">Remote</option>
            </select>
            <Button
              variant="outline"
              className="border-slate-200 bg-white lg:ml-auto"
            >
              <RiFilter3Line className="size-4 text-blue-700" />
              Filters
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee ID</th>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Branch</th>
                  <th className="px-4 py-3 font-semibold">Device</th>
                  <th className="px-4 py-3 font-semibold">Clock In</th>
                  <th className="px-4 py-3 font-semibold">Clock Out</th>
                  <th className="px-4 py-3 font-semibold">Hours</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Clocking Method</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.employeeId}
                    className="bg-white hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-[#0f172a]">
                      {record.employeeId}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-[#0f172a]">
                          {record.name}
                        </p>
                        <p className="text-xs text-slate-500">{record.team}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {record.branch}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {record.device}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {record.clockIn}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {record.clockOut}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {record.hours}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusStyles[record.status]}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {record.method}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon-sm">
                          <RiEyeLine className="size-4" />
                          <span className="sr-only">View attendance</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon-sm">
                              <RiMore2Fill className="size-4" />
                              <span className="sr-only">Attendance actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View timeline</DropdownMenuItem>
                            <DropdownMenuItem>Request correction</DropdownMenuItem>
                            <DropdownMenuItem>Export record</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredRecords.length ? 1 : 0} to{" "}
              {filteredRecords.length} of {records.length} records
            </span>
            <div className="flex items-center gap-2">
              <select className="h-9 rounded-lg border border-input bg-white px-3 text-sm">
                <option>10 per page</option>
                <option>25 per page</option>
              </select>
              <Button variant="outline" size="icon-sm">
                <RiArrowLeftSLine className="size-4" />
              </Button>
              <Button className="size-8 bg-blue-700 text-white hover:bg-blue-800">
                1
              </Button>
              <Button variant="outline" size="icon-sm">
                <RiArrowRightSLine className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
