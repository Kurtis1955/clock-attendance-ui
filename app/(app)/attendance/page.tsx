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
import { Spinner } from "@chakra-ui/react";
import { useUserPermissions } from "@/hoc/permissions-context";
import { toast } from "sonner";

type AttendanceStatus = "Present" | "Absent" | "On Duty" | "Remote";

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

export default function AttendancePage() {
  const { permissions: userPermissions } = useUserPermissions();
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAttendant, setSelectedAttendant] = useState<any | null>(null);
  const [attendantModalAction, setAttendantModalAction] = useState<
    "add" | "view" | "edit" | "search"
  >("view");
  const [isAttendantModalOpen, setIsAttendantModalOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [filterData, setFilterData] = useState("");
  const [loadingRoleDetails, setLoadingUserDetails] = useState(false);
  const [loading, setLoading] = useState(false);
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
        setTotalItems(attendanceSearch?.totalElements);
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
      setLoading(true);
      const payload = {
        page: 0,
        size: 10,
        sortDir: "desc",
        sortBy: "verifyTime",
      };

      const res = await fetch(`/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setAttendanceRecords(data.content);
        setTotalItems(data.totalElements);
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error Fecthing Attendance:", error);
      toast.error("Failed fetching Attendance", {
        position: "top-right",
        style: {
          color: "#dc2626",
          background: "#fff",
          border: "1px solid #dc2626",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRowAction = (actionType: any, rowData: any) => {
    console.log("actionType", actionType, "rowData>>", rowData);

    if (actionType === "view" && !canViewAttendance) return;
    if (actionType === "edit" && !canManageAttendance) return;

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

  const fetchOptions = async (inputValue: string): Promise<any[]> => {
    if (!inputValue) return [];

    try {
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

  const canCreateAttendance = userPermissions.some((permission) =>
    [
      "manual_attendance_create",
      "manual_attendance_manage",
      "attendance_manage",
    ].some((hint) => permission.toLowerCase().includes(hint)),
  );

  const canManageAttendance = userPermissions.some((permission) =>
    ["manual_attendance_manage", "attendance_manage"].some((hint) =>
      permission.toLowerCase().includes(hint),
    ),
  );

  const canViewAttendance = userPermissions.some((permission) =>
    [
      "manual_attendance_read",
      "manual_attendance_manage",
      "manual_attendance_create",
      "attendance_manage",
      "attendance_read",
    ].some((hint) => permission.toLowerCase().includes(hint)),
  );

  return (
    <div className="flex flex-col gap-5 px-2 xl:px-8 pt-2">
      <PageHeader
        title="Attendance Command Center"
        // description="Monitor workforce coverage, device sync health, and verified clocking activity across branches."
        actions={
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 md:flex md:justify-end">
            <Button
              variant="outline"
              className="h-10 border-slate-200 bg-white"
            >
              <RiDownloadLine className="size-4 text-gray-700" />
              Export
            </Button>
            <Button
              variant="outline"
              className="h-10 border-slate-200 bg-white"
              disabled={!canCreateAttendance}
              onClick={() => {
                if (!canCreateAttendance) return;

                setSelectedAttendant(null);
                setAttendantModalAction("search");
                setIsAttendantModalOpen(true);
              }}
            >
              <RiBarChartBoxLine className="size-4 text-gray-700" />
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
        {/* <div className="w-2/3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
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
        </div> */}
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-10">
            <Spinner size="xl" />
          </div>
        )}
        <DataTable
          columns={attendanceTableColumns(handleRowAction, {
            canViewAttendance,
            canManageAttendance,
          })}
          data={attendanceRecords}
          pageCount={pageCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          type="users"
          defaultColumns={["Drag", "Actions", "User Number"]}
          totalItems={totalItems ? totalItems : attendanceSearch?.totalElements}
        />
      </div>

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
                    : "Search for user"}
            </DialogTitle>
            <DialogDescription>
              {attendantModalAction === "add"
                ? "Create a new attendance record."
                : attendantModalAction === "edit"
                  ? "Update the selected attendance record."
                  : "Select a user to manually submit his/her attendant record."}
            </DialogDescription>
          </DialogHeader>
          {attendantModalAction === "search" ? (
            <div>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={debouncedFetchOptions}
                onChange={handleChange}
                placeholder="Search for a device user..."
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
              callback={fetchAttendance}
              onClose={() => setIsAttendantModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
