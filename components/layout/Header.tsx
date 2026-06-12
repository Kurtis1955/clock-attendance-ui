"use client";

import * as React from "react";
import {
  RiArrowDownSLine,
  RiBuilding2Line,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiNotification3Line,
  RiSearchLine,
  RiUser3Line,
} from "react-icons/ri";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { branchOptions, currentUser } from "@/lib/constants";

import { useLayout } from "./layout-context";

const NOTIFICATION_COUNT = 8;

export function Header() {
  const { toggleMobile } = useLayout();
  const [selectedBranch, setSelectedBranch] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedBranchLabel =
    branchOptions.find((b) => b.value === selectedBranch)?.label ??
    "All Branches";

  return (
    <header
      className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 lg:px-18"
      role="banner"
    >
      {/* Mobile Menu */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-slate-600 hover:text-[#0f172a] lg:hidden"
        onClick={toggleMobile}
        aria-label="Open navigation menu"
      >
        <RiMenuLine className="size-5" />
      </Button>

      {/* Search */}
      <div className="w-1/2 flex items-center gap-2">
        {/* <div className="relative min-w-0 flex-1 max-w-xl">
          <label htmlFor="global-search" className="sr-only">
            Search
          </label>
          <RiSearchLine
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            id="global-search"
            type="search"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-slate-200 bg-slate-50 pl-10 pr-16 text-sm focus-visible:bg-white"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div> */}

        {/* Branch Selector */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="hidden h-10 gap-2 border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex"
              aria-label="Select branch"
            >
              <RiBuilding2Line className="size-4 text-slate-500" />
              <span className="max-w-[120px] truncate">
                {selectedBranchLabel}
              </span>
              <RiArrowDownSLine className="size-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Branch</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedBranch}
              onValueChange={setSelectedBranch}
            >
              {branchOptions.map((branch) => (
                <DropdownMenuRadioItem key={branch.value} value={branch.value}>
                  {branch.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {/* Right Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative size-10 text-slate-600 hover:text-[#0f172a]"
          aria-label={`Notifications, ${NOTIFICATION_COUNT} unread`}
        >
          <RiNotification3Line className="size-5" />
          <Badge
            className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] font-bold text-white"
            aria-hidden="true"
          >
            {NOTIFICATION_COUNT}
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#eab308]/50 focus-visible:outline-none"
              aria-label="Open user account menu"
            >
              <Avatar className="size-9 border border-slate-200">
                <AvatarFallback className="bg-[#0f172a] text-xs font-semibold text-[#eab308]">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-[#0f172a]">
                  {currentUser.name}
                </p>
                <p className="text-xs text-[#64748b]">{currentUser.role}</p>
              </div>
              <RiArrowDownSLine className="hidden size-4 text-slate-400 md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{currentUser.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {currentUser.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RiUser3Line className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <RiLogoutBoxRLine className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
