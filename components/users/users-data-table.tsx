"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiArrowUpSLine,
  RiDeleteBinLine,
  RiEditLine,
  RiEyeLine,
  RiFilter3Line,
  RiMore2Fill,
  RiSearchLine,
} from "react-icons/ri"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  branchFilterOptions,
  managedUsers,
  roleBadgeStyles,
  roleFilterOptions,
  statusBadgeStyles,
  statusFilterOptions,
  userStats,
  type ManagedUser,
} from "@/lib/users-data"
import { cn } from "@/lib/utils"

function SortableHeader({
  label,
  sorted,
  onSort,
}: {
  label: string
  sorted: false | "asc" | "desc"
  onSort: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSort}
      className="group inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-[#64748b] uppercase transition-colors hover:text-[#0f172a]"
    >
      {label}
      {sorted === "asc" ? (
        <RiArrowUpSLine className="size-3.5 text-[#eab308]" />
      ) : sorted === "desc" ? (
        <RiArrowDownSLine className="size-3.5 text-[#eab308]" />
      ) : (
        <RiArrowUpDownLine className="size-3.5 opacity-40 group-hover:opacity-100" />
      )}
    </button>
  )
}

function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  options: readonly { value: string; label: string }[]
  ariaLabel: string
}) {
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0f172a] outline-none transition-colors focus-visible:border-[#eab308] focus-visible:ring-2 focus-visible:ring-[#eab308]/20"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function UsersDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [branchFilter, setBranchFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [rowSelection, setRowSelection] = React.useState({})

  const filteredData = React.useMemo(() => {
    return managedUsers.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesBranch =
        branchFilter === "all" || user.branch === branchFilter
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter
      return matchesRole && matchesBranch && matchesStatus
    })
  }, [roleFilter, branchFilter, statusFilter])

  const columns = React.useMemo<ColumnDef<ManagedUser>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all users on this page"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Select ${row.original.name}`}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortableHeader
            label="User"
            sorted={column.getIsSorted()}
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-slate-200">
              <AvatarFallback className="bg-slate-100 text-xs font-semibold text-[#0f172a]">
                {row.original.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#0f172a]">
                {row.original.name}
              </p>
              <p className="truncate text-xs text-[#64748b]">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <SortableHeader
            label="Role"
            sorted={column.getIsSorted()}
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={cn(
              "rounded-md px-2.5 py-0.5 text-xs font-medium",
              roleBadgeStyles[row.original.role]
            )}
          >
            {row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: "branch",
        header: ({ column }) => (
          <SortableHeader
            label="Branch"
            sorted={column.getIsSorted()}
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-[#0f172a]">{row.original.branch}</span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <SortableHeader
            label="Status"
            sorted={column.getIsSorted()}
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => {
          const config = statusBadgeStyles[row.original.status]
          return (
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                config.badge
              )}
            >
              <span
                className={cn("size-1.5 rounded-full", config.dot)}
                aria-hidden="true"
              />
              {config.label}
            </Badge>
          )
        },
        sortingFn: (rowA, rowB) =>
          rowA.original.status.localeCompare(rowB.original.status),
      },
      {
        accessorKey: "lastLoginAt",
        header: ({ column }) => (
          <SortableHeader
            label="Last Login"
            sorted={column.getIsSorted()}
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-[#64748b]">{row.original.lastLogin}</span>
        ),
      },
      {
        accessorKey: "devices",
        header: ({ column }) => (
          <SortableHeader
            label="Devices"
            sorted={column.getIsSorted()}
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium text-[#0f172a]">
            {row.original.devices}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-slate-500 hover:text-[#0f172a]"
                aria-label="Open user actions"
              >
                <RiMore2Fill className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>
                <RiEyeLine className="size-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RiEditLine className="size-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <RiDeleteBinLine className="size-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).toLowerCase()
      const user = row.original
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.branch.toLowerCase().includes(query)
      )
    },
    initialState: {
      pagination: { pageSize: 8 },
    },
  })

  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const filteredCount = table.getFilteredRowModel().rows.length
  const start = filteredCount === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, filteredCount)
  const totalPages = table.getPageCount()
  const enterpriseTotalPages = Math.ceil(userStats.total / pageSize)

  function handleResetFilters() {
    setGlobalFilter("")
    setRoleFilter("all")
    setBranchFilter("all")
    setStatusFilter("all")
    table.resetColumnFilters()
    table.setPageIndex(0)
  }

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/60 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-[220px] flex-1 max-w-md">
            <RiSearchLine className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value)
                table.setPageIndex(0)
              }}
              placeholder="Search users..."
              className="h-10 border-slate-200 bg-white pl-10"
              aria-label="Search users"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              value={roleFilter}
              onChange={(value) => {
                setRoleFilter(value)
                table.setPageIndex(0)
              }}
              options={roleFilterOptions}
              ariaLabel="Filter by role"
            />
            <FilterSelect
              value={branchFilter}
              onChange={(value) => {
                setBranchFilter(value)
                table.setPageIndex(0)
              }}
              options={branchFilterOptions}
              ariaLabel="Filter by branch"
            />
            <FilterSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value)
                table.setPageIndex(0)
              }}
              options={statusFilterOptions}
              ariaLabel="Filter by status"
            />
            <Button
              variant="outline"
              className="h-10 border-slate-200 bg-white"
            >
              <RiFilter3Line className="size-4" />
              More Filters
            </Button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2 text-sm font-medium text-[#64748b] transition-colors hover:text-[#0f172a]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-slate-200 bg-slate-50"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-4 py-3 first:w-12 last:w-14"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80 data-[state=selected]:bg-[#eab308]/5"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-16 text-center text-sm text-[#64748b]"
                  >
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#64748b]">
            Showing{" "}
            <span className="font-medium text-[#0f172a]">
              {start} to {end}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#0f172a]">
              {userStats.total.toLocaleString()}
            </span>{" "}
            users
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
              className="border-slate-200"
            >
              <RiArrowLeftSLine className="size-4" />
            </Button>

            {Array.from(
              { length: Math.min(totalPages, 3) },
              (_, i) => i + 1
            ).map((page) => {
              const isActive = pageIndex + 1 === page
              return (
                <Button
                  key={page}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(page - 1)}
                  className={cn(
                    "min-w-8 px-2",
                    isActive
                      ? "bg-[#eab308] text-[#0f172a] hover:bg-yellow-500"
                      : "border-slate-200 bg-white"
                  )}
                  aria-label={`Page ${page}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </Button>
              )
            })}

            {enterpriseTotalPages > 3 && (
              <>
                <span className="px-1 text-sm text-[#64748b]">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(totalPages - 1)}
                  className="min-w-8 border-slate-200 bg-white px-2"
                  aria-label={`Page ${enterpriseTotalPages}`}
                >
                  {enterpriseTotalPages.toLocaleString()}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
              className="border-slate-200"
            >
              <RiArrowRightSLine className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
