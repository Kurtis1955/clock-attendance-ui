"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PermissionPicker } from "@/components/users/permission-picker";
import { normalizeIdList } from "@/lib/user-payload";
import {
  validateMinimumTextLength,
  validateRequiredText,
  validateRoleNameText,
} from "@/lib/helpers";
import { toast } from "sonner";

type Roleenabled = "Active" | "Inactive";
type RoleType = "System" | "Custom";

interface AddEditRoleProps {
  actionType: "add" | "edit" | "view";
  existingRoleData?: any;
  callback?: (role: any) => void;
  onClose?: () => void;
  existingRolePermission: any;
}

interface RoleFormErrors {
  name?: string;
  description?: string;
  permissions?: string;
}

export default function AddEditRole({
  actionType,
  existingRoleData,
  existingRolePermission,
  callback,
  onClose,
}: AddEditRoleProps) {
  const [name, setName] = useState(existingRoleData?.name || "");
  const [description, setDescription] = useState(
    existingRoleData?.description || "",
  );
  const [type, setType] = useState<RoleType>(
    existingRoleData?.type || "Custom",
  );
  const [enabled, setenabled] = useState<boolean>(
    Boolean(existingRoleData?.enabled),
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    normalizeIdList(existingRoleData?.permissions),
  );
  const [errors, setErrors] = useState<RoleFormErrors>({});

  const isView = actionType === "view";

  useEffect(() => {
    setName(existingRoleData?.name || "");
    setDescription(existingRoleData?.description || "");
    setType(existingRoleData?.type || "Custom");
    setenabled(Boolean(existingRoleData?.enabled));
    setSelectedPermissions(normalizeIdList(existingRoleData?.permissions));
    setErrors({});
  }, [existingRoleData]);

  useEffect(() => {
    async function loadRolePermissions() {
      const roleId = existingRoleData?.id;

      if (!roleId || actionType === "add") {
        return;
      }

      try {
        const response = await fetch(`/api/roles/${roleId}/permissions`);

        if (!response.ok) {
          return;
        }

        const json = await response.json();
        const content = json?.data?.permissions ?? json?.data ?? [];
        const permissionIds = Array.isArray(content)
          ? content
              .map((item: { permissionId?: string } | string) =>
                typeof item === "string" ? item : (item.permissionId ?? ""),
              )
              .filter(Boolean)
          : normalizeIdList(content);

        if (permissionIds.length) {
          setSelectedPermissions(permissionIds);
        }
      } catch (error) {
        toast.error("Failed to fetch role permissions ", {
          position: "top-right",
          style: {
            color: "#dc2626",
            background: "#fff",
            border: "1px solid #dc2626",
          },
        });
        console.error("Error loading role permissions:", error);
      }
    }

    loadRolePermissions();
  }, [existingRoleData?.id, actionType]);

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

  const handlePermissionChange = (permissionIds: string[]) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      permissions: undefined,
    }));
    setSelectedPermissions(permissionIds);
  };

  const handleRoleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload = {
        name: name,
        description: description,
        enabled: enabled ? enabled : false,
      };

      if (actionType === "add") {
        const res = await fetch("/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          console.log("role created successfully");
          toast.success("Role created successfully", {
            position: "top-right",
            style: {
              color: "#16a34a",
              background: "#fff",
              border: "1px solid #16a34a",
            },
          });
          onClose?.();
        } else {
          toast("Failed to create role", {
            position: "top-right",
            style: {
              color: "#dc2626",
              background: "#fff",
              border: "1px solid #dc2626",
            },
          });
          console.log("an error occurred");
        }
      } else {
        const res = await fetch(`/api/roles/${existingRoleData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (selectedPermissions.length) {
          const permission = await fetch(
            `/api/roles/${existingRoleData.id}/default-permissions`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(selectedPermissions),
            },
          );
          if (permission.ok) {
            console.log("role updated successfully");
            toast.success("Role permissions updated successfully", {
              position: "top-right",
              style: {
                color: "#16a34a",
                background: "#fff",
                border: "1px solid #16a34a",
              },
            });
            onClose?.();
          } else {
            console.log("an error occurred");
            toast("Failed to create role", {
              position: "top-right",
              style: {
                color: "#dc2626",
                background: "#fff",
                border: "1px solid #dc2626",
              },
            });
          }
        }
        if (res.ok) {
          console.log("role updated successfully");
          toast.success("Role updated successfully", {
            position: "top-right",
            style: {
              color: "#16a34a",
              background: "#fff",
              border: "1px solid #16a34a",
            },
          });
        } else console.log("an error occurred");
      }
    } catch (error) {}
  };

  return (
    <form className="w-full space-y-5" onSubmit={handleRoleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
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
            className="text-xs border-gray-300"
          />
          {errors.name ? (
            <p id="role-name-error" className="text-xs text-red-500">
              {errors.name}
            </p>
          ) : null}
        </div>

        {/* <div className="space-y-1.5">
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
        </div> */}

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
            className="text-xs border-gray-300"

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
            checked={enabled}
            disabled={isView}
            onChange={(event) => setenabled(event.target.checked)}
          />
          <Label>Active Role</Label>
        </div>
      </div>

      <PermissionPicker
        selectedPermissionIds={selectedPermissions}
        onChange={handlePermissionChange}
        disabled={isView}
        error={errors.permissions}
      />

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
