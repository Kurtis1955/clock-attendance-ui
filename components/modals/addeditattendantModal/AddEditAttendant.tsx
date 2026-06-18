"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AttendanceStatus = "Present" | "Absent" | "On Duty" | "Remote";

export interface AttendantRecord {
  employeeId: string;
  name: string;
  team: string;
  branch: string;
  device: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: AttendanceStatus;
  method: string;
}

interface AddEditAttendantProps {
  actionType: "add" | "view" | "edit";
  existingAttendantData?: Partial<AttendantRecord> | null;
  callback?: (record: AttendantRecord) => void;
  onClose?: () => void;
}

const emptyRecord: AttendantRecord = {
  employeeId: "",
  name: "",
  team: "",
  branch: "",
  device: "",
  clockIn: "",
  clockOut: "",
  hours: "",
  status: "Present",
  method: "",
};

const statusOptions: AttendanceStatus[] = [
  "Present",
  "Absent",
  "On Duty",
  "Remote",
];

export default function AddEditAttendant({
  actionType,
  existingAttendantData,
  callback,
  onClose,
}: AddEditAttendantProps) {
  const [formData, setFormData] = useState<AttendantRecord>(
    { ...emptyRecord, ...existingAttendantData },
  );

  const isViewMode = actionType === "view";

  useEffect(() => {
    setFormData({ ...emptyRecord, ...existingAttendantData });
  }, [existingAttendantData]);

  const updateField = <K extends keyof AttendantRecord>(
    field: K,
    value: AttendantRecord[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    callback?.(formData);
    onClose?.();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Employee Name</Label>
          <Input
            value={formData.name}
            disabled={isViewMode}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Employee name"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Employee ID</Label>
          <Input
            value={formData.employeeId}
            disabled={isViewMode || actionType === "edit"}
            onChange={(event) => updateField("employeeId", event.target.value)}
            placeholder="Employee ID"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Team</Label>
          <Input
            value={formData.team}
            disabled={isViewMode}
            onChange={(event) => updateField("team", event.target.value)}
            placeholder="Team"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Branch</Label>
          <Input
            value={formData.branch}
            disabled={isViewMode}
            onChange={(event) => updateField("branch", event.target.value)}
            placeholder="Branch"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Device</Label>
          <Input
            value={formData.device}
            disabled={isViewMode}
            onChange={(event) => updateField("device", event.target.value)}
            placeholder="Device"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Method</Label>
          <Input
            value={formData.method}
            disabled={isViewMode}
            onChange={(event) => updateField("method", event.target.value)}
            placeholder="Clocking method"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Clock In</Label>
          <Input
            value={formData.clockIn}
            disabled={isViewMode}
            onChange={(event) => updateField("clockIn", event.target.value)}
            placeholder="Clock in time"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Clock Out</Label>
          <Input
            value={formData.clockOut}
            disabled={isViewMode}
            onChange={(event) => updateField("clockOut", event.target.value)}
            placeholder="Clock out time"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Hours</Label>
          <Input
            value={formData.hours}
            disabled={isViewMode}
            onChange={(event) => updateField("hours", event.target.value)}
            placeholder="Total hours"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Status</Label>
          <select
            value={formData.status}
            disabled={isViewMode}
            onChange={(event) =>
              updateField("status", event.target.value as AttendanceStatus)
            }
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isViewMode ? (
        <div className="flex justify-end border-t pt-5">
          <Button
            type="submit"
            className="min-w-28 bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-400"
          >
            {actionType === "add" ? "Save Attendance" : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end border-t pt-5">
          <Button
            type="button"
            onClick={onClose}
            className="min-w-28 bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-400"
          >
            Close
          </Button>
        </div>
      )}
    </form>
  );
}
