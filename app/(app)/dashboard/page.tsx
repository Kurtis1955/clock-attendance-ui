"use client";
import { ChartLineLabel } from "@/components/attendance-chart";
import { AttendanceTrendCard } from "@/components/dashboard/AttendanceTrendCard";
import { DeviceHealthCard } from "@/components/dashboard/DeviceHealthCard";
// import { RecentAttendanceTable } from "@/components/dashboard/RecentAttendanceTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@chakra-ui/react";
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
import {
  format,
  startOfToday,
  endOfToday,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useEffect, useState } from "react";
import DashboardFilter from "@/components/ui/DashboardFilter";
import {
  recentAttendanceRecords,
  type AttendanceMethod,
  type AttendanceStatus,
  type RecentAttendanceRecord,
} from "@/lib/dashboard-data";
import Link from "next/link";

const stats = [
  {
    title: "Total Application Users",
    value: "458",
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
    value: "347",
    change: "+12.4% from yesterday",
    icon: RiCalendarCheckLine,
    iconColor: "text-[#eab308] bg-yellow-50",
  },
];

export default function DashboardPage() {
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [loadingStats, setloadingStats] = useState(true);
  const [cardsValue, setCardsValue] = useState<any>([]);
  const toast = useToast();

  useEffect(() => {
    const now = new Date();
    const startDateD = format(startOfMonth(now), "yyyy-MM-dd");
    const endOfMonthD = format(endOfMonth(now), "yyyy-MM-dd");

    Promise.all([
      getDashboardCards(startDateD, endOfMonthD),
      // getDashboardGraph(startDateD, endOfMonthD),
    ]);
  }, []);

  const handleDashboardFilterGraph = async (filterData: any) => {
    console.log("filterData>>", filterData);
    getDashboardCards(
      filterData.startDate,
      filterData.endDate,
      // selectedDepartment
    );
    // getDashboardGraph(filterData.startDate, filterData.endDate,selectedDepartment);

    // const query = `startDate=${filterData.startDate}&endDate=${filterData.endDate}`;
    // console.log("query", query);
    // setpageRouteQuery(query);
    // setContextState({
    //   ...contextState,
    //   incidentReportCacheName: filterData,
    //   taskReportCacheName: filterData,
    // });
  };

  const getDashboardCards = async (startDate: any, endDate: any) => {
    setloadingStats(true);
    try {
      let query = `startDate=${startDate}&endDate=${endDate}`;

      console.log("query to fetch dashboard data", query);
      // return;

      const res = await fetch(`/api/dashboard`);
      if (res.ok) {
        const result = await res.json();
        console.log("result>>Cards", result);
        setCardsValue(result);
        setloadingStats(false);
      } else {
        toast({
          title: "Error!",
          description: "Failed to load stats",
          status: "error", // 'info', 'warning', 'error', 'success'
          duration: 3000, // Duration in milliseconds
          isClosable: true, // Allows closing the toast
        });
      }
    } catch (error) {
      setloadingStats(false);
      toast({
        title: "Error!",
        description: "Failed to load stats",
        status: "error", // 'info', 'warning', 'error', 'success'
        duration: 3000, // Duration in milliseconds
        isClosable: true, // Allows closing the toast
      });
      setloadingStats(false);
    }
  };

  // const getDashboardGraph = async (startDate: any, endDate: any) => {
  //   setloadingStats(true);
  //   try {
  //     let query;
  //     query = `startDate=${startDate}&endDate=${endDate}`;

  //     console.log("query to fetch dashboard data", query);
  //     // return;
  //     const res = await fetch(`/api/dashboard?${query}`);
  //     if (res.ok) {
  //       const result = await res.json();
  //       //console.log("result graph", result);

  //       // setGraphMetrics({
  //       //   ...graphMetrics,
  //       //   ...result,
  //       //   timePeriods: result.timePeriods.map((r) => {
  //       //     return format(r, "dd-MM-yyyy");
  //       //   }),
  //       // });
  //     }
  //   } catch (error) {
  //     //  console.log("error>>", error);
  //     setloadingStats(false);
  //     toast({
  //       title: "Error!",
  //       description: "Failed to load stats",
  //       status: "error", // 'info', 'warning', 'error', 'success'
  //       duration: 3000, // Duration in milliseconds
  //       isClosable: true, // Allows closing the toast
  //     });
  //     setloadingStats(false);
  //   }
  // };

  const fetchRecentAttendance = async () => {
    setLoadingAttendance(true);
    setAttendanceError(null);

    try {
      const startDate = format(startOfToday(), "yyyy-MM-dd");
      const endDate = format(endOfToday(), "yyyy-MM-dd");
      const res = await fetch(
        `/api/attendance?paginate=true&pageNo=${0}&pageSize=${7}`,
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch recent attendance: ${res.status}`);
      }

      const data = await res.json();
      const records = data?.content;

      if (records.length) {
        setRecentAttendance(records.slice(0, 7));
      } else {
        setRecentAttendance(recentAttendanceRecords);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load recent attendance.";
      setAttendanceError(message);
      console.error(message, error);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const stats = [
    {
      title: "Total Application Users",
      value: cardsValue.userStats?.totalUsers,
      change: "+15.2% from last month",
      icon: FaUserFriends,
      iconColor: "text-purple-600 bg-purple-50",
    },
    {
      title: "Total Device Users ",
      value: cardsValue.userStats?.linkedToDeviceCount,
      change: "-3.2% from last week",
      icon: FaUser,
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      title: "Total Devices",
      value: cardsValue.deviceStats?.totalDevices,
      change: "+8.1% from last month",
      icon: MdOutlineOnDeviceTraining,
      iconColor: "text-green-600 bg-green-50",
    },
    {
      title: "Active Devices",
      value: cardsValue.deviceStats?.activeDevices,
      change: "+12.4% from yesterday",
      icon: RiCalendarCheckLine,
      iconColor: "text-[#eab308] bg-yellow-50",
    },
  ];

  useEffect(() => {
    void fetchRecentAttendance();
  }, []);

  return (
    <div className="px-2 xl:px-8 pt-2">
      <PageHeader
        title="Dashboard"
        // description="Welcome back! Here's what's happening across your biometric network today."
        actions={
          <div className="w-full md:flex md:justify-end grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* <Button variant="outline">
              <RiAddLine className="size-4" />
              Add User
            </Button>
            <Button variant="outline">
              <RiAddLine className="size-4" />
              Register Device
            </Button>
            <Button variant="outline">View Attendance</Button> */}
            {/* <DashboardFilter
              defaultValue={"thisMonth"}
              custom={null}
              // onFilterChange={0}
              // custom={contextState.incidentReportCacheName}
              onFilterChange={handleDashboardFilterGraph}
            /> */}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-0">
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
                {/* <p className="mt-1 text-xs text-green-600">{stat.change}</p> */}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 h-120 w-full flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-3/4 h-full">
          {/* <AttendanceTrendCard /> */}
          {/* <ChartLineLabel /> */}
          <div className="w-full h-full overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="w-full flex justify-between border-b px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Recent Attendance
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Showing the latest attendance records.
                </p>
              </div>
              <Link
                href="/attendance"
                className="text-sm text-blue-600 hover:underline"
              >
                View All Attendance
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-slate-700">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Ecode</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Direction</th>
                    <th className="px-4 py-3">Device</th>
                    <th className="px-4 py-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loadingAttendance ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-5 text-center text-slate-500"
                      >
                        Loading attendance...
                      </td>
                    </tr>
                  ) : attendanceError ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-5 text-center text-red-500"
                      >
                        {attendanceError}
                      </td>
                    </tr>
                  ) : recentAttendance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-5 text-center text-slate-500"
                      >
                        No recent attendance records found.
                      </td>
                    </tr>
                  ) : (
                    recentAttendance.map((record) => (
                      <tr
                        key={record.attId ?? record.userId ?? record.verifyTime}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          {record.verifyTime}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {record.userName || "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {record.userEmail || "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {record.userEcode || "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {record.statusName || record.status || "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {record.statusDirection || "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {record.deviceName || record.deviceSn || "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {record.deviceLocation || record.source || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/4 h-full">
          <DeviceHealthCard onLineDevice = {cardsValue.deviceStats?.onlineDevices} offLineDevice = {cardsValue.deviceStats?.offlineDevices}/>
        </div>
      </div>

      {/* <div className="mt-6">
        <RecentAttendanceTable
          records={recentAttendance}
          loading={loadingAttendance}
          error={attendanceError}
        />
      </div> */}
    </div>
  );
}
