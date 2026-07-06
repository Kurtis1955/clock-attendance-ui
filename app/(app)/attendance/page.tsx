"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RiBarChartBoxLine,
  RiDownloadLine,
  RiSearchLine,
} from "react-icons/ri";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/data-table";
import { attendanceTableColumns } from "@/components/tables/attendanceTable/attendance-table";
import { regrexForSpecialDashChars } from "@/lib/helpers";
import AddEditAttendant from "@/components/modals/addeditattendantModal/AddEditAttendant";
import useSearchAttendance from "@/hooks/useSearchAttendance";
import _debounce from "lodash/debounce";
import AsyncSelect from "react-select/async";

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

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [attendanceRecords, setAttendanceRecords] =
    useState<AttendanceRecord[]>(records);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState();
  const [selectedAttendant, setSelectedAttendant] =
    useState<AttendanceRecord | null>(null);
  const [attendantModalAction, setAttendantModalAction] = useState<
    "add" | "view" | "edit" | "search"
  >("view");
  const [isAttendantModalOpen, setIsAttendantModalOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [filterData, setFilterData] = useState("");
  const [loadingRoleDetails, setLoadingUserDetails] = useState(false);

  const {
    inputValue,
    handleInputRoleChange,
    attendanceSearch,
    error: attendanceSearchError,
    loading: loadingRole,
  } = useSearchAttendance({ pageCount, pageSize, filterData });

  //useEffect implemented to run the function
  // which fetches attendance Records
  useEffect(() => {
    if (inputValue == "") {
      fetchAttendance();
    } else {
      if (attendanceSearch?.content?.length) {
        console.log("roleSearch>>>", attendanceSearch);
        setAttendanceRecords(attendanceSearch?.content);
        setLoadingUserDetails(!loadingRoleDetails);
      } else {
        setAttendanceRecords([]);
        setLoadingUserDetails(!loadingRoleDetails);
      }
    }
    console.log("loadingRoleDetails>>", loadingRoleDetails);
  }, [attendanceSearch?.content?.length, inputValue, pageCount, pageSize]);

  // fetch attendance api consumed using the fetchAttendance function.
  // the function runs to get data from the api and stores in a react
  // state which is used for the listing in the table
  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/attendance");

      if (res.ok) {
        const data = await res.json();
        setAttendanceRecords(data.content);
        setTotalItems(data.totalElements);
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error Fecthing Attendance:", error);
    }
  };

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
    setPageSize(pageSize);
    setPageCount(pageIndex);
  };

  const handleChangeTextSearch = (e: any) => {
    const dataToSearch = regrexForSpecialDashChars(e.target.value);
    setSearchQuery(dataToSearch);
    debouncedSearch(dataToSearch);
  };

  const debouncedSearch = _debounce(handleInputRoleChange, 500);

  const handleAttendantSave = (updatedAttendant: AttendanceRecord) => {
    setAttendanceRecords((currentRecords) => {
      const recordExists = currentRecords.some(
        (record) => record.employeeId === updatedAttendant.employeeId,
      );

      if (!recordExists) {
        return [updatedAttendant, ...currentRecords];
      }

      return currentRecords.map((record) =>
        record.employeeId === updatedAttendant.employeeId
          ? updatedAttendant
          : record,
      );
    });
  };

  const fetchOptions = async (inputValue: string): Promise<any[]> => {
    if (!inputValue) return [];

    try {
      //http://192.168.251.152:8021/api/v1/admin-service/users/active-directory?search=kwaku&first=0&max=5
      const url = `/api/enrollment/?search=${inputValue}&first=0&max=5`;
      // console.log("url>>", url);
      const response = await fetch(`${url}`);
      const data = await response.json();
      // console.log("data search>>", data);

      // Transform the API data to match the react-select option format
      const searchedInfo = data.content.map((item: any) => {
        if (item.firstName || item.lastName) {
          return {
            value: item.id,
            label: item.firstName + " - " + item.email,
            ...item,
          };
        }
      });
      //console.log("searchedData", searchedInfo);
      return searchedInfo.filter((r: any) => r !== undefined);
    } catch (error) {
      /// console.error("Error fetching options:", error);
      return [];
    }
  };

  const handleChange = (selectedOption: any | null) => {
    setSelectedAttendant(selectedOption);
    setAttendantModalAction("add");
    setIsAttendantModalOpen(true);
  };

  const debouncedFetchOptions = useCallback(
    _debounce((inputValue: string, callback: (options: any[]) => void) => {
      fetchOptions(inputValue).then(callback);
    }, 300), // Adjust debounce delay (300ms in this case)
    [],
  );

  const searchSelectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: 44,
      borderRadius: 12,
      borderColor: "#d1d5db",
      boxShadow: "none",
      transition: "border-color 150ms ease",
      "&:hover": {
        borderColor: "#cbd5e1",
      },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f8fafc" : "white",
      color: "#0f172a",
      cursor: "pointer",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#64748b",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#0f172a",
    }),
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
              onClick={() => {
                setSelectedAttendant(null);
                setAttendantModalAction("search");
                setIsAttendantModalOpen(true);
              }}
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
          {/* <Button variant="outline" className="border-slate-200 bg-white ">
            <RiFilter3Line className="size-4 text-blue-700" />
            Filters
          </Button> */}
        </div>
      </div>

      <DataTable
        columns={attendanceTableColumns(handleRowAction)}
        data={attendanceRecords}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        type="users"
        defaultColumns={["Drag", "Actions", "User Number"]}
        totalItems={totalItems ? totalItems : attendanceSearch?.totalElements}
      />

      <Dialog
        open={isAttendantModalOpen}
        onOpenChange={setIsAttendantModalOpen}
      >
        <DialogContent
          className={`sm:max-w-3xl ${attendantModalAction === "search" ? "sm:h-auto" : ""}`}
        >
          <DialogHeader>
            <DialogTitle>
              {attendantModalAction === "add"
                ? "Add Attendance"
                : attendantModalAction === "edit"
                  ? "Edit Attendant"
                  : attendantModalAction === "view"
                    ? "View Attendant"
                    : "Search Attendant"}
            </DialogTitle>
            <DialogDescription>
              {attendantModalAction === "add"
                ? "Create a new attendance record."
                : attendantModalAction === "edit"
                  ? "Update the selected attendance record."
                  : "Review the selected attendance record."}
            </DialogDescription>
          </DialogHeader>
          {attendantModalAction === "search" ? (
            <div>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={debouncedFetchOptions}
                onChange={handleChange}
                placeholder="Search for active directory user..."
                styles={searchSelectStyles}
                menuPosition="absolute"
                menuPlacement="auto"
                menuShouldScrollIntoView={false}
                closeMenuOnScroll
                closeMenuOnSelect
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          ) : (
            <AddEditAttendant
              actionType={attendantModalAction}
              existingAttendantData={selectedAttendant}
              callback={handleAttendantSave}
              onClose={() => setIsAttendantModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
