import Link from "next/link"
import {
  RiAddLine,
  RiArrowDownSLine,
  RiDownloadLine,
  RiUploadLine,
} from "react-icons/ri"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UsersPageHeader() {
  return (
    <div className="mb-6 space-y-4 sm:mb-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-[#64748b]">
          <li>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-[#0f172a]"
            >
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-[#0f172a]">Users</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
          Users
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-[#eab308] text-[#0f172a] hover:bg-yellow-500">
            <RiAddLine className="size-4" />
            Add User
          </Button>
          <Button variant="outline" className="border-slate-200 bg-white">
            <RiUploadLine className="size-4" />
            Import Users
          </Button>
          <Button variant="outline" className="border-slate-200 bg-white">
            <RiDownloadLine className="size-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-200 bg-white">
                Bulk Actions
                <RiArrowDownSLine className="size-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Activate Selected</DropdownMenuItem>
              <DropdownMenuItem>Deactivate Selected</DropdownMenuItem>
              <DropdownMenuItem>Assign to Branch</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
