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

export const roleTableColumns = (rowCallback: any) => {
  return [
    {
      accessorKey: "drag",
      headerLabel: "Drag",
      header: () => "#",
      cell: () => (
        <div className="cursor-grab">
          <RxDragHandleDots2 />
        </div>
      ),
      size: 40,
    },

    {
      accessorKey: "name",
      headerLabel: "Role Name",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role Name
          <TfiExchangeVertical />
        </Button>
      ),
      cell: ({ row }: { row: any }) => {
        const permissionCount = row.original.permissions?.length || 0;

        return (
          <div className="flex items-center gap-3">
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${
                 "bg-blue-100 text-blue-600"
              }`}
            >
              <RiShieldCheckLine className="size-5" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                {row.original.name}
              </p>

              <p className="text-xs text-slate-500">
                {permissionCount} permissions
              </p>
            </div>
          </div>
        );
      },
      size: 250,
    },

    {
      accessorKey: "description",
      headerLabel: "Description",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <TfiExchangeVertical />
        </Button>
      ),
      cell: ({ row }: { row: any }) => (
        <div className="max-w-75 truncate text-slate-700">
          {row.original.description}
        </div>
      ),
    },

    {
      accessorKey: "type",
      headerLabel: "Type",
      header: "Type",
      cell: ({ row }: { row: any }) => (
        <Badge
          className={
            row.original.type === "System"
              ? "bg-blue-50 text-blue-700"
              : "bg-green-50 text-green-700"
          }
        >
          {row.original.type}
        </Badge>
      ),
    },

    {
      accessorKey: "users",
      headerLabel: "Users",
      header: "Users",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2 text-slate-700">
          <RiUserLine className="size-4" />
          {row.original.users}
        </div>
      ),
    },

    {
      accessorKey: "status",
      headerLabel: "Status",
      header: "Status",
      cell: ({ row }: { row: any }) => (
        <Badge
          className={
            row.original.status === "Active"
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-red-500"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },

    {
      accessorKey: "actions",
      headerLabel: "Actions",
      header: () => <div className="text-right pr-2">Actions</div>,

      cell: ({ row }: { row: any }) => (
        <div className="flex justify-end gap-2">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <RiMore2Fill />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => rowCallback("duplicate", row.original)}
              >
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => rowCallback("audit", row.original)}
              >
                Audit Log
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => rowCallback("delete", row.original)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
};
