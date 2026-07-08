import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";

export const attendanceTableColumns = (rowCallback: any) => [
  {
    accessorKey: "userName",
    header: "Employee",
    headerLabel: "Employee",
    cell: ({ row }: { row: any }) => (
      <div>
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
    header: "Device",
    headerLabel: "Device",
    cell: ({ row }: { row: any }) => (
      <div>
        {/* <Badge variant="outline">{row.original.deviceName}</Badge> */}

        <h1 className="mt-1 text-sm text-slate-500">{row.original.deviceName}</h1>
      </div>
    ),
  },

  {
    accessorKey: "deviceLocation",
    header: "Location",
    headerLabel: "Location",
  },

  {
    accessorKey: "verifyTime",
    header: "Verification Time",
    headerLabel: "Verification Time",
    cell: ({ row }: { row: any }) => (
      <div className="text-gray-600">{row.original.verifyTime}</div>
    ),
  },

  {
    accessorKey: "source",
    header: "Source",
    headerLabel: "Source",
    cell: ({ row }: { row: any }) => (
      <div className=" text-gray-600">{row.original.source}</div>
    ),
  },

  {
    accessorKey: "statusDirection",
    header: "Direction",
    headerLabel: "Status Direction",
    cell: ({ row }: { row: any }) => (
      <Badge
        className={
          row.original.statusDirection === "IN"
            ? "bg-green-100 text-green-700 w-1/3"
            : "bg-orange-100 text-orange-700 w-1/3"
        }
      >
        {row.original.statusDirection}
      </Badge>
    ),
  },

  {
    accessorKey: "statusName",
    header: "Status",
    headerLabel: "Status",
    cell: ({ row }: { row: any }) => (
      <Badge
        className={
          row.original.statusName === "Check-in"
            ? "bg-green-100 text-green-700 w-2/3"
            : row.original.statusName === "Check-out"
              ? "bg-red-100 text-red-700 w-2/3"
              : row.original.statusName === "Break-out"
                ? "bg-amber-100 text-amber-700 w-2/3"
                : row.original.statusName === "Break-in"
                  ? "bg-blue-100 text-blue-700 w-2/3"
                  : "bg-slate-100 text-slate-700 w-2/3"
        }
      >
        {row.original.statusName}
      </Badge>
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
            onClick={() => rowCallback("view", row.original)}
          >
            <FaEye />
          </Button>
        </Tooltip>

        <Tooltip label="Edit" hasArrow placement="bottom">
          <Button
            disabled={row.original.source?.toLowerCase() === "sdk"}
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
