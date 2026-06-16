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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/data-table";
import { attendanceTableColumns } from "@/components/tables/attendanceTable/attendance-table";
import _debounce from "lodash/debounce";
import { regrexForSpecialDashChars } from "@/lib/helpers";
import AddEditAttendant from "@/components/modals/addeditattendantModal/AddEditAttendant";

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
    status: "Present",
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
    status: "Present",
    method: "Fingerprint",
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
  {
    branch: "Kumasi Branch",
    present: 318,
    expected: 340,
    color: "bg-green-500",
  },
  { branch: "Tema Branch", present: 274, expected: 302, color: "bg-amber-500" },
  {
    branch: "Takoradi Branch",
    present: 221,
    expected: 248,
    color: "bg-cyan-500",
  },
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
  const [attendanceRecords, setAttendanceRecords] =
    useState<AttendanceRecord[]>(records);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterData, setFilterData] = useState("");
  const [selectedAttendant, setSelectedAttendant] =
    useState<AttendanceRecord | null>(null);
  const [attendantModalAction, setAttendantModalAction] = useState<
    "view" | "edit"
  >("view");
  const [isAttendantModalOpen, setIsAttendantModalOpen] = useState(false);

  const totalPages = Math.ceil(attendanceRecords.length / pageSize);
  const currentPageRecords = attendanceRecords.slice(
    (pageCount - 1) * pageSize,
    pageCount * pageSize,
  );

  const handleChangeTextSearch = (e: any) => {
    const dataToSearch = regrexForSpecialDashChars(e.target.value);
    setSearchQuery(dataToSearch);
    debouncedSearch(dataToSearch);
  };

  const debouncedSearch = _debounce((query: string) => {
    if (query.trim() === "") {
      setAttendanceRecords(records);
    } else {
      const filteredData = records.filter((attendant) => {
        const fullName = `${attendant.name}`.toLowerCase();
        return (
          fullName.includes(query.toLowerCase()) ||
          attendant.employeeId.toLowerCase().includes(query.toLowerCase()) ||
          attendant.branch.toLowerCase().includes(query.toLowerCase())
        );
      });
      setAttendanceRecords(filteredData);
    }
  }, 300);

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
  
  // setAttendanceRecords(filteredRecords);

  const handleRowAction = (actionType: any, rowData: any) => {
    console.log("actionType", actionType, "rowData>>", rowData);
    if (actionType === "edit") {
      setSelectedAttendant(rowData);
      setAttendantModalAction("edit");
      setIsAttendantModalOpen(true);
      console.log("edit action clicked", rowData.employeeId);
      Promise.all([
        // getUserPermissionsByUserId(rowData.userName),
        // getUserById(rowData.userName),
      ]);
    } else if (actionType === "view") {
      setSelectedAttendant(rowData);
      setAttendantModalAction("view");
      setIsAttendantModalOpen(true);
      Promise.all([
        // getUserPermissionsByUserId(rowData.userName),
        // getUserById(rowData.userName),
      ]);
      // setisLDAP(false);
      console.log("isGeneralModalOpen:", true);
    } else if (actionType == "switch") {
      // getChangeUserStatus(rowData);
    }
  };

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    //fetchPageData(pageIndex, pageSize);
    console.log("pageIndex@11>>", pageIndex, "pageSize>>", pageSize);
    setPageCount(pageIndex);
    setPageSize(pageSize);
  };

  const handleAttendantSave = (updatedAttendant: AttendanceRecord) => {
    setAttendanceRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.employeeId === updatedAttendant.employeeId
          ? updatedAttendant
          : record,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-5 px-2 pt-2 lg:px-8">
      <PageHeader
        title="Attendance Command Center"
        // description="Monitor workforce coverage, device sync health, and verified clocking activity across branches."
        actions={
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 md:flex md:justify-end">
            <Button
              variant="outline"
              className="h-10 border-slate-200 bg-white"
            >
              <RiDownloadLine className="size-4 text-blue-700" />
              Export
            </Button>
            <Button
              variant="outline"
              className="h-10 border-slate-200 bg-white"
            >
              <RiBarChartBoxLine className="size-4 text-blue-700" />
              Add Attendance
            </Button>
            {/* <Button className="bg-blue-700 text-white hover:bg-blue-800">
              <RiRefreshLine className="size-4" />
              Sync Records
            </Button> */}
          </div>
        }
      />

      <div className="w-full flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-1/3 relative">
          <Input
            type="search"
            placeholder="Search by name, employee ID, or device..."
            value={searchQuery}
            onChange={(e) => {
              handleChangeTextSearch(e);
              setFilterData("");
            }}
            className="w-full h-10 pr-10"
          />
          <RiSearchLine className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
        </div>
        <div className="w-2/3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <select
            value={branchFilter}
            onChange={(event) => setBranchFilter(event.target.value)}
            className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-44"
          >
            <option value="all">All Companies</option>
            {branchCoverage.map((item) => (
              <option key={item.branch} value={item.branch}>
                {item.branch}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-36"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="on-duty">On Duty</option>
            <option value="remote">Remote</option>
          </select>
          <Button variant="outline" className="border-slate-200 bg-white ">
            <RiFilter3Line className="size-4 text-blue-700" />
            Filters
          </Button>
        </div>
      </div>

      <DataTable
        columns={attendanceTableColumns(handleRowAction)}
        data={filteredRecords || attendanceRecords}
        pageCount={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        type="users"
        defaultColumns={["Drag", "Actions", "User Number"]}
        totalItems={attendanceRecords.length}
      />

      <Dialog
        open={isAttendantModalOpen}
        onOpenChange={setIsAttendantModalOpen}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {attendantModalAction === "edit"
                ? "Edit Attendant"
                : "View Attendant"}
            </DialogTitle>
            <DialogDescription>
              {attendantModalAction === "edit"
                ? "Update the selected attendance record."
                : "Review the selected attendance record."}
            </DialogDescription>
          </DialogHeader>
          <AddEditAttendant
            actionType={attendantModalAction}
            existingAttendantData={selectedAttendant}
            callback={handleAttendantSave}
            onClose={() => setIsAttendantModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
