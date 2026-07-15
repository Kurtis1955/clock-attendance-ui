import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { TfiExchangeVertical } from "react-icons/tfi";
let sortValue = "asc";

export const attendanceTableColumns = (
  rowCallback: any,
  permissions: {
    canViewAttendance?: boolean;
    canManageAttendance?: boolean;
  } = {},
) => {
  const canViewAttendance = permissions.canViewAttendance ?? true;
  const canManageAttendance = permissions.canManageAttendance ?? true;

  return [
    {
      accessorKey: "userName",
      // header: "Employee",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "userName" });
          }}
        >
          Employee
          <TfiExchangeVertical />
        </Button>
      ),
      headerLabel: "Employee",
      cell: ({ row }: { row: any }) => (
        <div className="ml-3">
          <p className="font-medium text-slate-800">{row.original.userName}</p>

          <p className="text-xs text-slate-500">
            {row.original.userEmail || "No Department"}
          </p>
        </div>
      ),
    },

    // {
    //   accessorKey: "userPin",
    //   header: "User Pin",
    // },

    {
      accessorKey: "deviceName",
      // header: "Device",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "deviceName" });
          }}
        >
          Device
          <TfiExchangeVertical />
        </Button>
      ),
      headerLabel: "Device",
      cell: ({ row }: { row: any }) => (
        <div>
          {/* <Badge variant="outline">{row.original.deviceName}</Badge> */}

          <h1 className="mt-1 text-sm text-slate-500 ml-3">
            {row.original.deviceName}
          </h1>
        </div>
      ),
    },

    {
      accessorKey: "deviceLocation",
      // header: "Location",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "deviceLocation" });
          }}
        >
          Location
          <TfiExchangeVertical />
        </Button>
      ),
      headerLabel: "Location",
      cell: ({ row }: { row: any }) => (
        <div className="text-gray-600 ml-3">{row.original.deviceLocation}</div>
      ),
    },

    {
      accessorKey: "verifyTime",
      // header: "Verification Time",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "verifyTime" });
          }}
        >
          Verification Time
          <TfiExchangeVertical />
        </Button>
      ),
      headerLabel: "Verification Time",
      cell: ({ row }: { row: any }) => (
        <div className="text-gray-600 ml-3">{row.original.verifyTime}</div>
      ),
    },

    {
      accessorKey: "verifyTypeName",
      // header: "verification Type",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "verifyTypeName" });
          }}
        >
          verification Type
          <TfiExchangeVertical />
        </Button>
      ),
      headerLabel: "verification Type",
      cell: ({ row }: { row: any }) => (
        <div className=" text-gray-600 ml-3">{row.original.verifyTypeName}</div>
      ),
    },

    {
      accessorKey: "statusDirection",
      // header: "Direction",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "statusDirection" });
          }}
        >
          Direction
          <TfiExchangeVertical />
        </Button>
      ),
      headerLabel: "Status Direction",
      cell: ({ row }: { row: any }) => (
        <div
          className="ml-3"
          // className={
          //   row.original.statusDirection === "IN"
          //     ? "bg-green-100 text-green-700 w-1/3"
          //     : "bg-orange-100 text-orange-700 w-1/3"
          // }
        >
          {row.original.statusDirection}
        </div>
      ),
    },

    {
      accessorKey: "statusName",
      // header: "Status",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "statusName" });
          }}
        >
          Status
          <TfiExchangeVertical />
        </Button>
      ),
      headerLabel: "Status",
      cell: ({ row }: { row: any }) => (
        <div
          className="ml-3"
          // className={
          //   row.original.statusName === "Check-in"
          //     ? "bg-green-100 text-green-700 w-2/3"
          //     : row.original.statusName === "Check-out"
          //       ? "bg-red-100 text-red-700 w-2/3"
          //       : row.original.statusName === "Break-out"
          //         ? "bg-amber-100 text-amber-700 w-2/3"
          //         : row.original.statusName === "Break-in"
          //           ? "bg-blue-100 text-blue-700 w-2/3"
          //           : "bg-slate-100 text-slate-700 w-2/3"
          // }
        >
          {row.original.statusName}
        </div>
      ),
    },

    {
      accessorKey: "actions",
      header: "Actions",
      headerLabel: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex justify-center gap-2">
          <Tooltip label="View" hasArrow placement="bottom">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={!canViewAttendance || !canManageAttendance}
              onClick={() => {
                if (!canViewAttendance) return;
                rowCallback("view", row.original);
              }}
            >
              <FaEye />
            </Button>
          </Tooltip>

          <Tooltip label="Edit" hasArrow placement="bottom">
            <Button
              disabled={
                !canManageAttendance ||
                row.original.source?.toLowerCase() === "sdk"
              }
              variant="outline"
              size="icon-sm"
              onClick={() => {
                if (!canManageAttendance) return;
                rowCallback("edit", row.original);
              }}
            >
              <RiEdit2Fill />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];
};
