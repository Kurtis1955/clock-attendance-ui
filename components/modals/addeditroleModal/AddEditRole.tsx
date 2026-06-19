"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getNavigationItemPermissionValues,
  navigationItems,
} from "@/lib/navigation";
import PermissionGroup from "@/hooks/permissions";
import {
  validateMinimumTextLength,
  validateRequiredText,
  validateRoleNameText,
} from "@/lib/helpers";

type RoleStatus = "Active" | "Inactive";
type RoleType = "System" | "Custom";

interface AddEditRoleProps {
  actionType: "add" | "edit" | "view";
  existingRoleData?: any;
  callback?: (role: any) => void;
  onClose?: () => void;
}

interface RoleFormErrors {
  name?: string;
  description?: string;
  permissions?: string;
}

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
  const [errors, setErrors] = useState<RoleFormErrors>({});

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
    setErrors({});
  }, [existingRoleData]);

  const validateForm = () => {
    const nextErrors: RoleFormErrors = {};
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const roleNameError = validateRoleNameText(trimmedName);
    const descriptionRequiredError = validateRequiredText(
      trimmedDescription,
      "Description",
    );
    const descriptionLengthError = validateMinimumTextLength(
      trimmedDescription,
      "Description",
      10,
    );

    if (roleNameError) {
      nextErrors.name = roleNameError;
    }

    if (descriptionRequiredError) {
      nextErrors.description = descriptionRequiredError;
    } else if (descriptionLengthError) {
      nextErrors.description = descriptionLengthError;
    }

    if (selectedPermissions.length === 0) {
      nextErrors.permissions = "Select at least one permission.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePermissionChange = (permissionValues: string[]) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      permissions: undefined,
    }));
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
    setErrors((currentErrors) => ({
      ...currentErrors,
      permissions: undefined,
    }));
    setSelectedPermissions((currentPermissions) =>
      currentPermissions.length === allPermissions.length ? [] : allPermissions,
    );
  };

  return (
    <form
      className="w-full space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!validateForm()) {
          return;
        }

        callback?.({
          ...existingRoleData,
          id:
            existingRoleData?.id ||
            `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: name.trim(),
          description: description.trim(),
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
            onChange={(event) => {
              setName(event.target.value);
              setErrors((currentErrors) => ({
                ...currentErrors,
                name: undefined,
              }));
            }}
            placeholder="Enter role name"
            disabled={isView}
            maxLength={50}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "role-name-error" : undefined}
            required
          />
          {errors.name ? (
            <p id="role-name-error" className="text-xs text-red-500">
              {errors.name}
            </p>
          ) : null}
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
            onChange={(event) => {
              setDescription(event.target.value);
              setErrors((currentErrors) => ({
                ...currentErrors,
                description: undefined,
              }));
            }}
            placeholder="Describe what this role can do"
            disabled={isView}
            maxLength={120}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "role-description-error" : undefined
            }
            required
          />
          {errors.description ? (
            <p id="role-description-error" className="text-xs text-red-500">
              {errors.description}
            </p>
          ) : null}
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
            {errors.permissions ? (
              <p className="mt-1 text-xs text-red-500">
                {errors.permissions}
              </p>
            ) : null}
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
