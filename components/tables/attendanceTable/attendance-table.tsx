import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";

export const attendanceTableColumns = (rowCallback: any) => [
  {
    accessorKey: "userName",
    header: "Employee",
    cell: ({ row }: { row: any }) => (
      <div>
        <p className="font-medium text-slate-800">
          {row.original.userName || row.original.userEmail}
        </p>

        <p className="text-xs text-slate-500">
          {row.original.departmentName || "No Department"}
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
    header: "Device",
    cell: ({ row }: { row: any }) => (
      <div>
        <Badge variant="outline">{row.original.deviceName}</Badge>

        <p className="mt-1 text-xs text-slate-500">
          {row.original.deviceSn}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "deviceLocation",
    header: "Location",
  },

  {
    accessorKey: "verifyTime",
    header: "Verification Time",
  },

  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }: { row: any }) => (
      <Badge className="bg-blue-50 text-blue-700">
        {row.original.source}
      </Badge>
    ),
  },

  {
    accessorKey: "statusDirection",
    header: "Direction",
    cell: ({ row }: { row: any }) => (
      <Badge
        className={
          row.original.statusDirection === "IN"
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-700"
        }
      >
        {row.original.statusDirection}
      </Badge>
    ),
  },

  {
    accessorKey: "statusName",
    header: "Status",
    cell: ({ row }: { row: any }) => (
      <Badge
        className={
          row.original.statusName === "Check-in"
            ? "bg-green-100 text-green-700"
            : row.original.statusName === "Check-out"
              ? "bg-red-100 text-red-700"
              : row.original.statusName === "Break-out"
                ? "bg-amber-100 text-amber-700"
                : row.original.statusName === "Break-in"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-700"
        }
      >
        {row.original.statusName}
      </Badge>
    ),
  },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => (
      <div className="flex justify-center gap-2">
        <Tooltip label="View" hasArrow placement="bottom">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("view", row.original)}
          >
            <FaEye />
          </Button>
        </Tooltip>

        <Tooltip label="Edit" hasArrow placement="bottom">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("edit", row.original)}
          >
            <RiEdit2Fill />
          </Button>
        </Tooltip>
      </div>
    ),
  },
];