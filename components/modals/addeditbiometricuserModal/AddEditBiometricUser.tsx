"use client";

import { useEffect, useState, type FormEvent } from "react";
import ReactSelect from "react-select";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type BiometricSyncStatus = "Synced" | "Pending" | "Failed";

export interface SelectOption {
  value: string;
  label: string;
}

export interface BiometricUserRecord {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  employeeId: string;
  phoneNumber: string;
  department: string;
  branch: string;
  userType: string;
  assignedDevices: SelectOption[];
  biometricMethods: string[];
  syncStatus: BiometricSyncStatus;
  dateAdded: string;
  lastSync: string;
  enabled: boolean;
}

interface AddEditBiometricUserProps {
  actionType: "add" | "edit" | "view";
  existingUserData?: Partial<BiometricUserRecord> | null;
  callback?: (record: BiometricUserRecord) => void;
  onClose?: () => void;
}

export const biometricDeviceOptions: SelectOption[] = [
  { value: "head-office-main", label: "Head Office - Main Entrance" },
  { value: "reception-front", label: "Reception - Front Desk" },
  { value: "warehouse-gate", label: "Warehouse - Gate" },
  { value: "server-room-access", label: "Server Room - Access" },
  { value: "finance-office", label: "Finance Office" },
];

const departmentOptions: SelectOption[] = [
  { value: "Information Technology", label: "Information Technology" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Operations", label: "Operations" },
  { value: "Finance", label: "Finance" },
  { value: "Security", label: "Security" },
];

const branchOptions: SelectOption[] = [
  { value: "Head Office", label: "Head Office" },
  { value: "Kumasi Branch", label: "Kumasi Branch" },
  { value: "Tema Branch", label: "Tema Branch" },
  { value: "Takoradi Branch", label: "Takoradi Branch" },
];

const userTypeOptions: SelectOption[] = [
  { value: "Device User", label: "Device User" },
  { value: "System User", label: "System User" },
];

const syncStatusOptions: BiometricSyncStatus[] = ["Synced", "Pending", "Failed"];
const biometricMethodOptions = ["Face", "Fingerprint", "Palm"];

const emptyBiometricUser: BiometricUserRecord = {
  id: "",
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  employeeId: "",
  phoneNumber: "",
  department: "",
  branch: "",
  userType: "Device User",
  assignedDevices: [],
  biometricMethods: ["Face"],
  syncStatus: "Pending",
  dateAdded: "",
  lastSync: "-",
  enabled: true,
};

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "40px",
    borderColor: state.isFocused ? "var(--ring)" : "var(--input)",
    borderRadius: "0.25rem",
    boxShadow: state.isFocused
      ? "0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent)"
      : "none",
    fontSize: "0.875rem",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "var(--muted-foreground)",
  }),
  multiValue: (base: any) => ({
    ...base,
    borderRadius: "0.375rem",
  }),
};

export default function AddEditBiometricUser({
  actionType,
  existingUserData,
  callback,
  onClose,
}: AddEditBiometricUserProps) {
  const [formData, setFormData] = useState<BiometricUserRecord>({
    ...emptyBiometricUser,
    ...existingUserData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isView = actionType === "view";

  useEffect(() => {
    setFormData({
      ...emptyBiometricUser,
      ...existingUserData,
      assignedDevices: existingUserData?.assignedDevices || [],
      biometricMethods:
        existingUserData?.biometricMethods || emptyBiometricUser.biometricMethods,
    });
    setErrors({});
  }, [existingUserData]);

  const updateField = <K extends keyof BiometricUserRecord>(
    field: K,
    value: BiometricUserRecord[K],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formData.employeeId.trim()) nextErrors.employeeId = "Employee ID is required.";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.department) nextErrors.department = "Department is required.";
    if (!formData.branch) nextErrors.branch = "Branch is required.";
    if (formData.assignedDevices.length === 0) {
      nextErrors.assignedDevices = "Assign at least one biometric device.";
    }
    if (formData.biometricMethods.length === 0) {
      nextErrors.biometricMethods = "Select at least one biometric method.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleMethodToggle = (method: string) => {
    setErrors((current) => ({ ...current, biometricMethods: "" }));
    setFormData((current) => ({
      ...current,
      biometricMethods: current.biometricMethods.includes(method)
        ? current.biometricMethods.filter((item) => item !== method)
        : [...current.biometricMethods, method],
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    callback?.({
      ...formData,
      id:
        formData.id ||
        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      userName: formData.userName.trim() || fullName,
      email: formData.email.trim(),
      employeeId: formData.employeeId.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      dateAdded: formData.dateAdded || "20 May 2024 10:32 AM",
      lastSync: formData.lastSync || "-",
    });
    onClose?.();
  };

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldError label="First Name" error={errors.firstName}>
          <Input
            value={formData.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            disabled={isView}
            placeholder="First name"
            required
          />
        </FieldError>

        <FieldError label="Last Name" error={errors.lastName}>
          <Input
            value={formData.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            disabled={isView}
            placeholder="Last name"
            required
          />
        </FieldError>

        <FieldError label="Employee ID" error={errors.employeeId}>
          <Input
            value={formData.employeeId}
            onChange={(event) => updateField("employeeId", event.target.value)}
            disabled={isView || actionType === "edit"}
            placeholder="EMP-2041"
            required
          />
        </FieldError>

        <FieldError label="Email" error={errors.email}>
          <Input
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            disabled={isView}
            placeholder="name@company.com"
            required
          />
        </FieldError>

        <FieldError label="Phone Number" error={errors.phoneNumber}>
          <Input
            type="tel"
            value={formData.phoneNumber}
            onChange={(event) => updateField("phoneNumber", event.target.value)}
            disabled={isView}
            placeholder="+233..."
          />
        </FieldError>

        <div className="space-y-1.5">
          <Label>User Type</Label>
          <ReactSelect
            isDisabled={isView}
            options={userTypeOptions}
            value={userTypeOptions.find((item) => item.value === formData.userType)}
            onChange={(option: any) => updateField("userType", option?.value || "")}
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            Department <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            isDisabled={isView}
            options={departmentOptions}
            value={departmentOptions.find((item) => item.value === formData.department)}
            onChange={(option: any) => updateField("department", option?.value || "")}
            placeholder="Select department"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
          {errors.department ? <p className="text-xs text-red-500">{errors.department}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label>
            Branch <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            isDisabled={isView}
            options={branchOptions}
            value={branchOptions.find((item) => item.value === formData.branch)}
            onChange={(option: any) => updateField("branch", option?.value || "")}
            placeholder="Select branch"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
          {errors.branch ? <p className="text-xs text-red-500">{errors.branch}</p> : null}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>
            Assigned Devices <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            isMulti
            isClearable
            closeMenuOnSelect={false}
            isDisabled={isView}
            options={biometricDeviceOptions}
            value={formData.assignedDevices}
            onChange={(selectedOptions) =>
              updateField(
                "assignedDevices",
                selectedOptions ? [...selectedOptions] : [],
              )
            }
            placeholder="Select biometric devices"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
          {errors.assignedDevices ? (
            <p className="text-xs text-red-500">{errors.assignedDevices}</p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>
            Biometric Methods <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {biometricMethodOptions.map((method) => (
              <label
                key={method}
                className="flex min-h-10 cursor-pointer items-center gap-2 rounded-sm border border-input px-3 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
              >
                <Checkbox
                  checked={formData.biometricMethods.includes(method)}
                  disabled={isView}
                  onCheckedChange={() => handleMethodToggle(method)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
          {errors.biometricMethods ? (
            <p className="text-xs text-red-500">{errors.biometricMethods}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label>Sync Status</Label>
          <select
            value={formData.syncStatus}
            disabled={isView}
            onChange={(event) =>
              updateField("syncStatus", event.target.value as BiometricSyncStatus)
            }
            className="h-10 w-full rounded-sm border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
          >
            {syncStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-end pb-2">
          <input
            className="size-4 rounded border-input text-primary focus:ring-ring"
            type="checkbox"
            checked={formData.enabled}
            disabled={isView}
            onChange={(event) => updateField("enabled", event.target.checked)}
          />
          <Label>Enable Biometric User</Label>
        </div>
      </div>

      {actionType !== "view" ? (
        <div className="flex justify-end border-t pt-5">
          <Button
            type="submit"
            className="min-w-28 bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-400"
          >
            {actionType === "edit" ? "Save Changes" : "Enroll User"}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end border-t pt-5">
          <Button
            type="button"
            onClick={onClose}
            className="min-w-24 bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Close
          </Button>
        </div>
      )}
    </form>
  );
}

function FieldError({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} <span className="text-red-500">*</span>
      </Label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
