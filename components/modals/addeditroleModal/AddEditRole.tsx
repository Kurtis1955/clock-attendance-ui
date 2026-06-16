"use client";

import { useEffect, useMemo, useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getNavigationItemPermissionValues,
  navigationItems,
  type NavigationItem,
} from "@/lib/navigation";
import PermissionGroup from "@/hooks/permissions";

type RoleStatus = "Active" | "Inactive";
type RoleType = "System" | "Custom";

interface AddEditRoleProps {
  actionType: "add" | "edit" | "view";
  existingRoleData?: any;
  callback?: (role: any) => void;
  onClose?: () => void;
}

// function PermissionGroup({
//   item,
//   disabled,
//   selectedPermissions,
//   onToggle,
// }: {
//   item: NavigationItem;
//   disabled: boolean;
//   selectedPermissions: string[];
//   onToggle: (permissionValues: string[]) => void;
// }) {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const permissionValues = getNavigationItemPermissionValues(item);
//   const childValues = item.children?.flatMap((child) =>
//     getNavigationItemPermissionValues(child),
//   );
//   const checkedCount = permissionValues.filter((permissionValue) =>
//     selectedPermissions.includes(permissionValue),
//   ).length;
//   const isChecked = permissionValues.every((permissionValue) =>
//     selectedPermissions.includes(permissionValue),
//   );
//   const hasChildren = Boolean(item.children?.length);
//   const Icon = item.icon;

//   return (
//     <div className="rounded-lg border border-input bg-background text-sm">
//       <div className="flex min-h-12 items-center gap-2 px-3 py-2">
//         {hasChildren ? (
//           <Button
//             type="button"
//             variant="ghost"
//             size="icon-xs"
//             className="shrink-0"
//             onClick={() => setIsExpanded((current) => !current)}
//             aria-label={isExpanded ? "Collapse permissions" : "Expand permissions"}
//           >
//             {isExpanded ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
//           </Button>
//         ) : (
//           <span className="size-6 shrink-0" />
//         )}

//         <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
//           <input
//             type="checkbox"
//             className="size-4 rounded border-input text-primary focus:ring-ring"
//             checked={isChecked}
//             disabled={disabled}
//             onChange={() => onToggle(permissionValues)}
//           />
//           <Icon className="size-4 shrink-0 text-slate-500" />
//           <span className="truncate font-medium text-slate-900">
//             {item.label}
//           </span>
//         </label>

//         <Badge variant="outline" className="shrink-0">
//           {checkedCount}/{permissionValues.length}
//         </Badge>
//       </div>

//       {hasChildren && isExpanded ? (
//         <div className="space-y-2 border-t border-slate-100 px-4 py-3 pl-12">
//           {item.children?.map((child) => {
//             const values = getNavigationItemPermissionValues(child);
//             const isChildChecked = values.every((permissionValue) =>
//               selectedPermissions.includes(permissionValue),
//             );
//             const ChildIcon = child.icon;

//             return (
//               <label
//                 key={child.href}
//                 className="flex min-h-7 cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
//               >
//                 <input
//                   type="checkbox"
//                   className="size-3.5 rounded border-input text-primary focus:ring-ring"
//                   checked={isChildChecked}
//                   disabled={disabled}
//                   onChange={() => onToggle(values)}
//                 />
//                 <ChildIcon className="size-3.5 shrink-0 text-slate-400" />
//                 <span className="truncate">{child.label}</span>
//               </label>
//             );
//           })}

//           {childValues?.length ? (
//             <Button
//               type="button"
//               variant="ghost"
//               size="xs"
//               className="mt-1 text-xs text-slate-600"
//               disabled={disabled}
//               onClick={() => onToggle(childValues)}
//             >
//               Toggle submenu permissions
//             </Button>
//           ) : null}
//         </div>
//       ) : null}
//     </div>
//   );
// }

export default function AddEditRole({
  actionType,
  existingRoleData,
  callback,
  onClose,
}: AddEditRoleProps) {
  const [name, setName] = useState(existingRoleData?.name || "");
  const [description, setDescription] = useState(
    existingRoleData?.description || "",
  );
  const [type, setType] = useState<RoleType>(existingRoleData?.type || "Custom");
  const [status, setStatus] = useState<RoleStatus>(
    existingRoleData?.status || "Active",
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    existingRoleData?.permissions || [],
  );

  const isView = actionType === "view";
  const selectedCount = selectedPermissions.length;
  const totalPermissionCount = useMemo(
    () =>
      navigationItems.reduce(
        (total, item) => total + getNavigationItemPermissionValues(item).length,
        0,
      ),
    [],
  );

  useEffect(() => {
    setName(existingRoleData?.name || "");
    setDescription(existingRoleData?.description || "");
    setType(existingRoleData?.type || "Custom");
    setStatus(existingRoleData?.status || "Active");
    setSelectedPermissions(existingRoleData?.permissions || []);
  }, [existingRoleData]);

  const handlePermissionChange = (permissionValues: string[]) => {
    setSelectedPermissions((currentPermissions) =>
      permissionValues.every((permissionValue) =>
        currentPermissions.includes(permissionValue),
      )
        ? currentPermissions.filter(
            (permission) => !permissionValues.includes(permission),
          )
        : Array.from(new Set([...currentPermissions, ...permissionValues])),
    );
  };

  const handleSelectAll = () => {
    const allPermissions = navigationItems.flatMap((item) =>
      getNavigationItemPermissionValues(item),
    );
    setSelectedPermissions((currentPermissions) =>
      currentPermissions.length === allPermissions.length ? [] : allPermissions,
    );
  };

  return (
    <form
      className="w-full space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        callback?.({
          ...existingRoleData,
          id:
            existingRoleData?.id ||
            `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name,
          description,
          type,
          users: existingRoleData?.users || 0,
          status,
          permissions: selectedPermissions,
          color: existingRoleData?.color || "bg-blue-50 text-blue-700",
        });
        onClose?.();
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>
            Role Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter role name"
            disabled={isView}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            Type <span className="text-red-500">*</span>
          </Label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as RoleType)}
            disabled={isView}
            className="h-10 w-full rounded-sm border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
          >
            <option value="Custom">Custom</option>
            <option value="System">System</option>
          </select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>
            Description <span className="text-red-500">*</span>
          </Label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe what this role can do"
            disabled={isView}
            required
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            className="size-4 rounded border-input text-primary focus:ring-ring"
            type="checkbox"
            checked={status === "Active"}
            disabled={isView}
            onChange={(event) =>
              setStatus(event.target.checked ? "Active" : "Inactive")
            }
          />
          <Label>Active Role</Label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label>
              Permissions <span className="text-red-500">*</span>
            </Label>
            <p className="mt-1 text-xs text-slate-500">
              {selectedCount} of {totalPermissionCount} permissions selected
            </p>
          </div>

          {!isView ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedCount === totalPermissionCount ? "Clear All" : "Select All"}
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {navigationItems.map((item) => (
            <PermissionGroup
              key={item.href}
              item={item}
              disabled={isView}
              selectedPermissions={selectedPermissions}
              onToggle={handlePermissionChange}
            />
          ))}
        </div>
      </div>

      {!isView ? (
        <div className="flex justify-end border-t pt-5">
          <Button
            type="submit"
            className="min-w-24 bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-400"
          >
            {actionType === "edit" ? "Save Changes" : "Save"}
          </Button>
        </div>
      ) : null}
    </form>
  );
}
