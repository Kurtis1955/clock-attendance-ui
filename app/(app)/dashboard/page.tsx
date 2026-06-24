"use client";
import { ChartLineLabel } from "@/components/attendance-chart";
import { AttendanceTrendCard } from "@/components/dashboard/AttendanceTrendCard";
import { DeviceHealthCard } from "@/components/dashboard/DeviceHealthCard";
import { RecentAttendanceTable } from "@/components/dashboard/RecentAttendanceTable";
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
  const toast = useToast();

  useEffect(() => {
    const now = new Date();
    const startDateD = format(startOfMonth(now), "yyyy-MM-dd");
    const endOfMonthD = format(endOfMonth(now), "yyyy-MM-dd");

    Promise.all([
      getDashboardCards(startDateD, endOfMonthD),
      getDashboardGraph(startDateD, endOfMonthD),
    ]);
  });

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

      const res = await fetch(`/api/dashboard/card?${query}`);
      if (res.ok) {
        const result = await res.json();
        console.log("result>>Cards", result);

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

  const getDashboardGraph = async (startDate: any, endDate: any) => {
    setloadingStats(true);
    try {
      let query;
      query = `startDate=${startDate}&endDate=${endDate}`;

      console.log("query to fetch dashboard data", query);
      // return;
      const res = await fetch(`/api/dashboard/graph?${query}`);
      if (res.ok) {
        const result = await res.json();
        //console.log("result graph", result);

        // setGraphMetrics({
        //   ...graphMetrics,
        //   ...result,
        //   timePeriods: result.timePeriods.map((r) => {
        //     return format(r, "dd-MM-yyyy");
        //   }),
        // });
      }
    } catch (error) {
      //  console.log("error>>", error);
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

  const fetchRecentAttendance = async () => {
    setLoadingAttendance(true);
    setAttendanceError(null);

    try {
      const startDate = format(startOfToday(), "yyyy-MM-dd");
      const endDate = format(endOfToday(), "yyyy-MM-dd");
      const response = await fetch(
        `/api/attendance?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&page=0&size=5`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch recent attendance: ${response.status}`,
        );
      }

      const data = await response.json();
      const records = data?.data?.content ?? data?.data ?? data;

      if (records.length) {
        setRecentAttendance(records.slice(0, 5));
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

  useEffect(() => {
    void fetchRecentAttendance();
  }, []);

  return (
    <div className="px-2 lg:px-8 pt-2">
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
            <DashboardFilter
              defaultValue={"thisMonth"}
              custom={null}
              // onFilterChange={0}
              // custom={contextState.incidentReportCacheName}
              onFilterChange={handleDashboardFilterGraph}
            />
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
                {/* <p className="mt-1 text-xs text-green-600">{stat.change}</p> */}
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
        <RecentAttendanceTable
          records={recentAttendance}
          loading={loadingAttendance}
          error={attendanceError}
        />
      </div>
    </div>
  );
}
