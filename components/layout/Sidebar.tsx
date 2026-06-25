"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiArrowDownSLine,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
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
import federatedLogout from "@/utils/federatedLogout";
import { useSession } from "next-auth/react";

interface SidebarContentProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { toggleCollapsed } = useLayout();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<any>({});
  const { data: session } = useSession();

  useEffect(() => {
    console.log("session>>", session);
    if (session?.user?.name) {
      setUserName(session.user.name as string);
      setUserEmail((session.user.email as string) ?? "");
    }
    fetchUserData();
    const activeParentHrefs = navigationItems
      .filter((item) =>
        item.children?.some((child) =>
          isNavigationActive(pathname, child.href),
        ),
      )
      .map((item) => item.href);

    setExpandedItems((currentItems) =>
      Array.from(new Set([...currentItems, ...activeParentHrefs])),
    );
  }, [pathname, session]);

  const fetchUserData = async () => {
    try {
      console.log(userName)
      const id = "catalystta"
      const res = await fetch(`/api/users/${id}/byusername`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data.data);
      }
    } catch (error) {}
  };

  const toggleExpandedItem = (href: string) => {
    setExpandedItems((currentItems) =>
      currentItems.includes(href)
        ? currentItems.filter((currentHref) => currentHref !== href)
        : [...currentItems, href],
    );
  };

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
            <Button
              type="button"
              onClick={toggleCollapsed}
              className="bg-white shadow-md text-black hover:bg-white"
            >
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
            const hasChildren = Boolean(item.children?.length);
            const childIsActive = item.children?.some((child) =>
              isNavigationActive(pathname, child.href),
            );
            const isExactActive = pathname === item.href;
            const isAdminActive = pathname.startsWith("/admin");
            const isExpanded =
              !collapsed &&
              hasChildren &&
              (expandedItems.includes(item.href) || Boolean(childIsActive));
            const Icon = item.icon;

            const linkContent = (
              <Link
                href={item.href === "/admin" ? "/users" : item.href}
                onClick={onNavigate}
                aria-current={isExactActive ? "page" : undefined}
                className={cn(
                  "group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#eab308]/50",
                  collapsed && "justify-center px-2",
                )}
              >
                <Icon
                  className={cn(
                    "size-5 shrink-0",
                    isExactActive
                      ? "text-[#0f172a]"
                      : childIsActive
                        ? "text-[#eab308]"
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

            return (
              <div key={item.href} className="space-y-1">
                <div
                  onClick={() => toggleExpandedItem(item.href)}
                  className={`rounded-sm px-1 flex items-center gap-1 ${
                    isExactActive && !isAdminActive
                      ? "bg-[#eab308] font-bold text-[#0f172a] shadow-sm"
                      : childIsActive
                        ? "bg-slate-800 font-semibold text-[#eab308]"
                        : "text-slate-300 hover:bg-slate-800 hover:text-[#eab308]"
                  }`}
                >
                  <div className="min-w-0 flex-1">{linkContent}</div>

                  {hasChildren ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => toggleExpandedItem(item.href)}
                      className={cn(
                        "shrink-0 text-slate-400 hover:bg-slate-800 hover:text-[#eab308]",
                        isExpanded && "text-[#eab308]",
                      )}
                      aria-label={
                        isExpanded
                          ? `Collapse ${item.label} submenu`
                          : `Expand ${item.label} submenu`
                      }
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <RiArrowDownSLine className="size-4" />
                      ) : (
                        <RiArrowRightSLine className="size-4" />
                      )}
                    </Button>
                  ) : null}
                </div>

                {isExpanded ? (
                  <div className="ml-5 space-y-1 border-l border-slate-700 pl-3">
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = isNavigationActive(
                        pathname,
                        child.href,
                      );

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onNavigate}
                          aria-current={isChildActive ? "page" : undefined}
                          className={cn(
                            "group flex min-h-8 items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#eab308]/50",
                            isChildActive
                              ? "bg-[#eab308] text-[#0f172a]"
                              : "text-slate-400 hover:bg-slate-800 hover:text-[#eab308]",
                          )}
                        >
                          <ChildIcon
                            className={cn(
                              "size-3.5 shrink-0",
                              isChildActive
                                ? "text-[#0f172a]"
                                : "text-slate-500 group-hover:text-[#eab308]",
                            )}
                            aria-hidden="true"
                          />
                          <span className="truncate">{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
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
                    {userName}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {userData.roleNames?.toUpperCase()} USER
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
                <span>{userName}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {userEmail}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RiUser3Line className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => federatedLogout()}
            >
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
