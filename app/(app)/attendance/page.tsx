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
import ReactSelect from "react-select";
import { Spinner } from "@chakra-ui/react";
import { useUserPermissions } from "@/hoc/permissions-context";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";

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

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 40,
    borderRadius: 8,
    borderColor: state.isFocused ? "#2563eb" : "#cbd5e1",
    boxShadow: state.isFocused ? "0 0 0 2px rgb(37 99 235 / 0.15)" : "none",
    "&:hover": {
      borderColor: "#94a3b8",
    },
    backgroundColor: "#fff",
  }),

  valueContainer: (base: any) => ({
    ...base,
    padding: "2px 8px",
    gap: 4,
  }),

  placeholder: (base: any) => ({
    ...base,
    color: "#94a3b8",
    fontSize: 14,
  }),

  input: (base: any) => ({
    ...base,
    margin: 0,
    padding: 0,
    fontSize: 14,
  }),

  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
  }),

  multiValueLabel: (base: any) => ({
    ...base,
    color: "#0f172a",
    fontWeight: 500,
    fontSize: 12,
    paddingLeft: 8,
  }),

  multiValueRemove: (base: any) => ({
    ...base,
    cursor: "pointer",
    borderRadius: 4,
    ":hover": {
      backgroundColor: "#ef4444",
      color: "#fff",
    },
  }),

  menu: (base: any) => ({
    ...base,
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 50,
  }),

  menuList: (base: any) => ({
    ...base,
    padding: 4,
  }),

  option: (base: any, state: any) => ({
    ...base,
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
        ? "#eff6ff"
        : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a",
    cursor: "pointer",
  }),

  dropdownIndicator: (base: any) => ({
    ...base,
    color: "#64748b",
    padding: 6,
  }),

  clearIndicator: (base: any) => ({
    ...base,
    color: "#64748b",
    padding: 6,
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  noOptionsMessage: (base: any) => ({
    ...base,
    color: "#94a3b8",
    fontSize: 14,
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filterDepartments, setFilterDepartments] = useState<
    { label: string; value: string }[]
  >([]);
  const [filterCompanies, setFilterCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [filterVerifyTypes, setFilterVerifyTypes] = useState("");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(
    undefined,
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(
    undefined,
  );
  const [exportStartDate, setExportStartDate] = useState<any>("");
  const [exportEndDate, setExportEndDate] = useState<any>("");
  const [departmentOptions, setDepartmentOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [companyOptions, setCompanyOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedDepartments, setSelectedDepartments] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCompanies, setSelectedCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [exporting, setExporting] = useState(false);
  const {
    inputValue,
    handleInputRoleChange,
    attendanceSearch,
    error: attendanceSearchError,
    loading: loadingRole,
  } = useSearchAttendance({ pageCount, pageSize, filterData });
  const [sortBy, setSortBy] = useState<any>("verifyTime");
  const [sortDir, setSortDir] = useState<any>("desc");
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/users/current-user");
        if (!response.ok) {
          throw new Error(`Failed to load departments (${response.status})`);
        }

        const data = await response.json();
        const userData = data.data.userDepartments;
        console.log("departments data>>", userData);
        const departmentOptions = userData.map((dept: any) => ({
          label: dept.departmentName,
          value: dept.departmentName,
        }));
        setDepartmentOptions(departmentOptions);
        const companyOptions = userData.map((dept: any) => ({
          label: dept.companyName,
          value: dept.companyName,
        }));
        setCompanyOptions(companyOptions);
      } catch (error) {
        console.error("Unable to load export department options:", error);
      }
    };

    void fetchDepartments();
  }, []);

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
  }, [
    attendanceSearch?.content?.length,
    inputValue,
    pageCount,
    pageSize,
    sortBy,
    sortDir,
  ]);

  // fetch attendance api consumed using the fetchAttendance function.
  // the function runs to get data from the api and stores in a react
  // state which is used for the listing in the table
  const fetchAttendance = async (requestedPageNo: number = pageCount) => {
    try {
      setLoading(true);
      const payload = {
        pageNo: requestedPageNo,
        pageSize: pageSize,
        sortDir,
        sortBy,
        departmentNames: filterDepartments.map((option) => option.value),
        companyNames: filterCompanies.map((option) => option.value),
        verifyTypeNames: filterVerifyTypes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        start: filterStartDate ? format(filterStartDate, "yyyy-MM-dd") : "",
        end: filterEndDate ? format(filterEndDate, "yyyy-MM-dd") : "",
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
    } else if (actionType == "sort") {
      console.log("sorting data>>>", rowData);
      setSortBy(rowData.field);
      setSortDir(rowData.sortValue);
      fetchAttendance();
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

  const handleApplyFilters = () => {
    setPageCount(0);
    void fetchAttendance(0);
  };

  const handleResetFilters = () => {
    setFilterDepartments([]);
    setFilterCompanies([]);
    setFilterVerifyTypes("");
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    setPageCount(0);
    void fetchAttendance(0);
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

  const formatDateInputToIso = (dateValue: string) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  };

  const exportAttendance = async () => {
    setExporting(true);
    try {
      const payload = {
        format: "PDF",
        startDate: formatDateInputToIso(exportStartDate),
        endDate: formatDateInputToIso(exportEndDate),
        departmentNames: selectedDepartments.map((option) => option.value),
        companyNames: selectedCompanies.map((option) => option.value),
        page: 0,
        size: 1000,
        limit: 1000,
        sortDir: "desc",
        sortBy: "verifyTime",
      };
      const response = await fetch("/api/attendance/export-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to export attendance report.");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "attendance-export.csv";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) {
          fileName = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsExportModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export failed";
      toast.error(message, {
        position: "top-right",
        style: {
          color: "#dc2626",
          background: "#fff",
          border: "1px solid #dc2626",
        },
      });
    } finally {
      setExporting(false);
    }
  };

  console.log("user department>>", departmentOptions, companyOptions);

  return (
    <div className="flex flex-col gap-5 px-2 xl:px-8 pt-2">
      <PageHeader
        title="Attendance"
        // description="Monitor workforce coverage, device sync health, and verified clocking activity across branches."
        actions={
          <div className="w-full flex gap-2 flex-wrap justify-between sm:justify-end">
            <Button
              variant="outline"
              className="w-25 h-10 border-gray-400 bg-white text-xs"
              onClick={() => setIsExportModalOpen(true)}
            >
              <RiDownloadLine className="size-4 text-gray-700" />
              Export
            </Button>
            <Button
              variant="outline"
              className="w-35 h-10 border-slate-200 bg-amber-400 text-black text-xs hover:bg-amber-500"
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

      <div className="w-full flex flex-col sm:flex-row gap-4  lg:items-start justify-between">
        <div className="w-full sm:w-[49%] relative">
          <Input
            type="search"
            placeholder="Search by name, employee ID, or device..."
            value={searchQuery}
            onChange={(e) => {
              handleChangeTextSearch(e);
            }}
            className="w-full h-10 pr-10 border-gray-400 text-xs"
          />
          <RiSearchLine className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="w-full sm:w-[49%] flex gap-2 justify-end">
          <Button
            className="w-35 h-9"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter
          </Button>
        </div>
      </div>

      {filterOpen && (
        <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Departments
              </label>
              <ReactSelect
                isMulti
                options={departmentOptions}
                value={filterDepartments}
                onChange={(options) =>
                  setFilterDepartments(Array.isArray(options) ? options : [])
                }
                placeholder="Select departments"
                styles={selectStyles}
                noOptionsMessage={() => "No departments found"}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Companies
              </label>
              <ReactSelect
                isMulti
                options={companyOptions}
                value={filterCompanies}
                onChange={(options) =>
                  setFilterCompanies(Array.isArray(options) ? options : [])
                }
                placeholder="Select companies"
                styles={selectStyles}
                noOptionsMessage={() => "No companies found"}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Start Date
              </label>
              <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 text-xs"
                  >
                    {filterStartDate
                      ? format(filterStartDate, "PPP")
                      : "Start date"}
                    <ChevronDownIcon data-icon="inline-end" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={filterStartDate}
                    captionLayout="dropdown"
                    defaultMonth={filterStartDate}
                    onSelect={(date) => {
                      setFilterStartDate(date);
                      setOpenStartDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                End Date
              </label>
              <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 text-xs"
                  >
                    {filterEndDate ? format(filterEndDate, "PPP") : "End date"}
                    <ChevronDownIcon data-icon="inline-end" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={filterEndDate}
                    captionLayout="dropdown"
                    defaultMonth={filterStartDate || filterEndDate}
                    onSelect={(date) => {
                      setFilterEndDate(date);
                      setOpenEndDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              className="h-9 px-6 bg-red-500 text-xs hover:bg-red-600"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button
              className="h-9 px-6 bg-amber-400 text-black text-xs hover:bg-amber-500"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

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

      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Attendance</DialogTitle>
            <DialogDescription>
              Choose a date range and one or more departments, then export the
              attendance report.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                {/* <label className="text-sm font-medium text-slate-700">
                  Start Date
                </label> */}
                {/* <Input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="w-full"
                /> */}
                <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker-optional"
                      className="w-full justify-between py-4.5 text-sm"
                    >
                      {exportStartDate
                        ? format(exportStartDate, "PPP")
                        : "Select start date"}
                      <ChevronDownIcon data-icon="inline-end" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={exportStartDate}
                      captionLayout="dropdown"
                      defaultMonth={exportStartDate}
                      onSelect={(date) => {
                        setExportStartDate(date);
                        setOpenStartDate(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                {/* <label className="text-sm font-medium text-slate-700">
                  End Date
                </label> */}
                {/* <Calendar
                  mode="single"
                  selected={exportEndDate}
                  onSelect={setExportEndDate}
                  className="w-full"
                /> */}
                <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker-optional"
                      className="w-full justify-between py-4.5 text-sm"
                    >
                      {exportEndDate
                        ? format(exportEndDate, "PPP")
                        : "Select end date"}
                      <ChevronDownIcon data-icon="inline-end" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={exportEndDate}
                      captionLayout="dropdown"
                      defaultMonth={exportStartDate}
                      onSelect={(date) => {
                        setExportEndDate(date);
                        setOpenEndDate(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Department
              </label>
              <ReactSelect
                isMulti
                options={departmentOptions}
                value={selectedDepartments}
                onChange={(options) =>
                  setSelectedDepartments(Array.isArray(options) ? options : [])
                }
                placeholder="Select departments"
                classNamePrefix="react-select"
                noOptionsMessage={() => "No departments found"}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Company
              </label>
              <ReactSelect
                isMulti
                options={companyOptions}
                value={selectedCompanies}
                onChange={(options) =>
                  setSelectedCompanies(Array.isArray(options) ? options : [])
                }
                placeholder="Select companies"
                classNamePrefix="react-select"
                noOptionsMessage={() => "No companies found"}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs"
                onClick={() => setIsExportModalOpen(false)}
                disabled={exporting}
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto bg-amber-400 text-black text-xs hover:bg-amber-500"
                onClick={async () => exportAttendance()}
                disabled={exporting}
              >
                {exporting ? "Exporting..." : "Export"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
