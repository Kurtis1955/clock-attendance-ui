"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
  RiCloseLine,
  RiLogoutBoxRLine,
  RiShieldCheckLine,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { currentUser, deviceStatus } from "@/lib/constants";
import { isNavigationActive, navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { useLayout } from "./layout-context";

interface SidebarContentProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { toggleCollapsed } = useLayout();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 border-b border-slate-800 px-4 py-5",
          collapsed && "justify-center px-2",
        )}
      >
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eab308] text-[#0f172a] shadow-md"
          aria-hidden="true"
        >
          <RiShieldCheckLine className="size-5" />
        </div>
        {!collapsed ? (
          <div className="min-w-0 w-full flex items-center justify-between gap-4">
            <div className="w-3/4">
              <p className="truncate text-base font-bold text-white">
                Biometric Hub
              </p>
              <p className="truncate text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                Management Platform
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={toggleCollapsed}
              className={cn(
                "w-1/4 justify-center gap-2 text-slate-400 hover:bg-slate-800 hover:text-[#eab308]",
                collapsed && "justify-center px-0",
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
            >
              <RiArrowLeftDoubleLine
                className={cn(
                  "size-4 transition-transform duration-300",
                  collapsed && "rotate-180",
                )}
              />
            </Button>
          </div>
        ) : (
          <div className="fixed left-16 flex items-center justify-center">
            <Button type="button" onClick={toggleCollapsed} className="bg-white shadow-md text-black hover:bg-white">
              <RiArrowRightDoubleLine className="size-4 text-[#0f172a]" />
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
        aria-label="Main navigation"
      >
        <TooltipProvider delayDuration={0}>
          {navigationItems.map((item) => {
            const isActive = isNavigationActive(pathname, item.href);
            const Icon = item.icon;

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#eab308]/50",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-[#eab308] font-bold text-[#0f172a] shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-[#eab308]",
                )}
              >
                <Icon
                  className={cn(
                    "size-5 shrink-0",
                    isActive
                      ? "text-[#0f172a]"
                      : "text-slate-400 group-hover:text-[#eab308]",
                  )}
                  aria-hidden="true"
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-[#0f172a] text-white"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </TooltipProvider>
      </nav>

      {/* Device Status Widget */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl border border-slate-700/80 bg-slate-800/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
              Device Status
            </span>
            <Badge
              variant="success"
              className="gap-1.5 border-green-500/30 bg-green-500/10 text-green-400"
            >
              <span
                className="size-1.5 rounded-full bg-green-400"
                aria-hidden="true"
              />
              Online
            </Badge>
          </div>
          <p className="text-lg font-bold text-white">
            {deviceStatus.onlineDevices}
            <span className="text-sm font-normal text-slate-400">
              {" "}
              / {deviceStatus.totalDevices} devices
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Last sync: {deviceStatus.lastSyncTime}
          </p>
        </div>
      )}

      {collapsed && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50">
                <span
                  className="size-2 rounded-full bg-green-400"
                  aria-label={`${deviceStatus.onlineDevices} devices online`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[#0f172a] text-white">
              {deviceStatus.onlineDevices} devices online
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Separator className="bg-slate-800" />

      {/* Profile */}
      <div className={cn("p-3", collapsed && "flex justify-center")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-[#eab308]/50 focus-visible:outline-none",
                collapsed && "w-auto justify-center p-2",
              )}
              aria-label="Open user menu"
            >
              <Avatar className="size-9 border border-slate-700">
                <AvatarFallback className="bg-slate-700 text-xs font-semibold text-[#eab308]">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {currentUser.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {currentUser.role}
                  </p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={collapsed ? "center" : "start"}
            side="top"
            className="w-56"
          >
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
    </div>
  );
}

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useLayout();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-slate-800 bg-[#0f172a] transition-[width] duration-300 ease-in-out lg:flex",
          collapsed ? "w-20" : "w-[280px]",
        )}
        aria-label="Application sidebar"
      >
        <SidebarContent collapsed={collapsed} />

        {/* Collapse Button */}
        {/* <div className="mt-auto border-t border-slate-800 p-3">
          <Button
            type="button"
            variant="ghost"
            onClick={toggleCollapsed}
            className={cn(
              "w-full justify-start gap-2 text-slate-400 hover:bg-slate-800 hover:text-[#eab308]",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <RiArrowLeftDoubleLine
              className={cn(
                "size-4 transition-transform duration-300",
                collapsed && "rotate-180",
              )}
            />
            {!collapsed && <span className="text-sm">Collapse</span>}
          </Button>
        </div> */}
      </aside>
    </>
  );
}

export function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useLayout();

  React.useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, setMobileOpen]);

  if (!mobileOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-800 bg-[#0f172a] shadow-xl animate-in slide-in-from-left duration-300 lg:hidden"
        aria-label="Mobile navigation drawer"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-end border-b border-slate-800 p-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close navigation menu"
          >
            <RiCloseLine className="size-5" />
          </Button>
        </div>
        <SidebarContent
          collapsed={false}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
}
