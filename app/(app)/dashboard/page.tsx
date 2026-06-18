import { ChartLineLabel } from "@/components/attendance-chart";
import { AttendanceTrendCard } from "@/components/dashboard/AttendanceTrendCard";
import { DeviceHealthCard } from "@/components/dashboard/DeviceHealthCard";
import { RecentAttendanceTable } from "@/components/dashboard/RecentAttendanceTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUserFriends } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { MdOutlineOnDeviceTraining } from "react-icons/md";
import {
  RiAddLine,
  RiCalendarCheckLine,
  RiFingerprintLine,
  RiRouterLine,
  RiUserAddLine,
} from "react-icons/ri";

const stats = [
  {
    title: "Total Application Users",
    value: "12,458",
    change: "+15.2% from last month",
    icon: FaUserFriends,
    iconColor: "text-purple-600 bg-purple-50",
  },
  {
    title: "Total Device Users ",
    value: "156",
    change: "-3.2% from last week",
    icon: FaUser,
    iconColor: "text-blue-600 bg-blue-50",
  },
  {
    title: "Total Devices",
    value: "342",
    change: "+8.1% from last month",
    icon: MdOutlineOnDeviceTraining,
    iconColor: "text-green-600 bg-green-50",
  },
  {
    title: "Today's Attendance",
    value: "9,847",
    change: "+12.4% from yesterday",
    icon: RiCalendarCheckLine,
    iconColor: "text-[#eab308] bg-yellow-50",
  },
];

export default function DashboardPage() {
  return (
    <div className="px-2 lg:px-8 pt-2">
      <PageHeader
        title="Dashboard"
        // description="Welcome back! Here's what's happening across your biometric network today."
        actions={
          <div className="w-full md:flex md:justify-end grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Button variant="outline">
              <RiAddLine className="size-4" />
              Add User
            </Button>
            <Button variant="outline">
              <RiAddLine className="size-4" />
              Register Device
            </Button>
            {/* <Button variant="outline">Enroll User</Button> */}
            <Button variant="outline">View Attendance</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#64748b]">
                  {stat.title}
                </CardTitle>
                <div
                  className={`flex size-9 items-center justify-center rounded-lg ${stat.iconColor}`}
                >
                  <Icon className="size-7" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[#0f172a]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-green-600">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 h-full grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 h-full">
          {/* <AttendanceTrendCard /> */}
          <ChartLineLabel />
        </div>
        <div className="lg:col-span-1 h-full">
          <DeviceHealthCard />
        </div>
      </div>

      <div className="mt-6">
        <RecentAttendanceTable />
      </div>
    </div>
  );
}
