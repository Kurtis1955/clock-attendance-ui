import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@chakra-ui/react";

import { RxDragHandleDots2 } from "react-icons/rx";
import { TfiExchangeVertical } from "react-icons/tfi";
import { RiShieldCheckLine } from "react-icons/ri";
import { RiUserLine } from "react-icons/ri";
import { RiMore2Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";

export const attendanceTableColumns = (rowCallback: any) => [
  {
    accessorKey: "name",
    header: "Employee",
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center gap-3">
        {/* <Avatar>
          <AvatarImage src={row.original.avatar} />
          <AvatarFallback>
            {row.original.employee
              ?.split(" ")
              .map((x: string) => x[0])
              .join("")}
          </AvatarFallback>
        </Avatar> */}

        <div>
          <p className="font-medium text-gray-600">{row.original.name}</p>

          <p className="text-xs text-slate-500">
            {row.original.team ?? row.original.department}
          </p>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "employeeId",
    header: "Employee Code",
  },

  {
    accessorKey: "branch",
    header: "Company",
  },

  {
    accessorKey: "device",
    header: "Device",
    cell: ({ row }: { row: any }) => (
      <Badge variant="outline">{row.original.device}</Badge>
    ),
  },

  {
    accessorKey: "method",
    header: "Clocking Method",
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center gap-2">{row.original.method}</div>
    ),
  },

  {
    accessorKey: "clockIn",
    header: "Clock In",
  },

  {
    accessorKey: "clockOut",
    header: "Clock Out",
    cell: ({ row }: { row: any }) => (
      <span>{row.original.clockOut || "--"}</span>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      const status = row.original.status;

      return (
        <Badge
          className={
            status === "Present"
              ? "bg-green-100 text-green-700"
              : status === "Late"
                ? "bg-yellow-100 text-yellow-700"
                : status === "Absent"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
          }
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "actions",
    header: "Actions",

    cell: ({ row }: { row: any }) => (
      <div className="flex justify-center gap-2">
        <Tooltip label={"View"} hasArrow placement="bottom">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("view", row.original)}
          >
            <FaEye />
          </Button>
        </Tooltip>

        <Tooltip label={"Edit"} hasArrow placement="bottom">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("edit", row.original)}
          >
            <RiEdit2Fill />
          </Button>
        </Tooltip>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <RiMore2Fill />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => rowCallback("attendance-details", row.original)}
            >
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => rowCallback("attendance-history", row.original)}
            >
              Attendance History
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => rowCallback("device-log", row.original)}
            >
              Device Logs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    ),
  },
];
