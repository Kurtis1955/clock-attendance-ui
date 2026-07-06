"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddEditAttendant({
  actionType,
  existingAttendantData,
  callback,
  onClose,
}: any) {
  const [userId, setUserId] = useState(existingAttendantData?.userId || "");
  const [firstName, setFirstName] = useState(
    existingAttendantData?.firstName || "",
  );
  const [lastName, setLastName] = useState(
    existingAttendantData?.lastName || "",
  );
  const [userEmail, setUserEmail] = useState(
    existingAttendantData?.email || "",
  );
  const [userEcode, setUserEcode] = useState(
    existingAttendantData?.e_code || "",
  );
  const [verifyTime, setVerifyTime] = useState(
    existingAttendantData?.verifyTime || "",
  );
  const [statusId, setStatusId] = useState(
    existingAttendantData?.statusId || "",
  );
  const [attendanceStatusOptions, setAttendanceStatusOptions] = useState<any[]>([]);
  const isViewMode = actionType === "view";

  useEffect(() => {
    setUserId(existingAttendantData?.userId || "");
    setFirstName(existingAttendantData?.firstName || "");
    setLastName(existingAttendantData?.lastName || "");
    setUserEmail(existingAttendantData?.email || "");
    setUserEcode(existingAttendantData?.e_code || "");
    setVerifyTime(existingAttendantData?.verifyTime || "");
    setStatusId(existingAttendantData?.statusId || "");
  }, [existingAttendantData]);

  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  const fetchAttendanceStatus = async () => {
    try {
      const response = await fetch(`/api/attendance/attendance-status`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendance status");
      }
      const data = await response.json();
      const options = data?.map((device: any) => ({
        label: device.name,
        value: device.id,
      }));
      console.log("attendanceStatusOptions>>", options);
      setAttendanceStatusOptions(options || [] );
    } catch (error) {
      console.error("Error fetching attendance status:", error);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    callback?.();
    onClose?.();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>First Name</Label>
          <Input
            value={firstName}
            disabled={isViewMode}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First Name"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Last Name</Label>
          <Input
            value={lastName}
            disabled={isViewMode}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last Name"
          />
        </div>

        <div className="space-y-1.5">
          <Label>User Email</Label>
          <Input
            value={userEmail}
            disabled={isViewMode}
            onChange={(event) => setUserEmail(event.target.value)}
            placeholder="User Email"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Employee Code</Label>
          <Input
            value={userEcode}
            disabled={isViewMode}
            onChange={(event) => setUserEcode(event.target.value)}
            placeholder="Employee Code"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Verify Time</Label>
          <Input
            value={verifyTime}
            disabled={isViewMode}
            onChange={(event) => setVerifyTime(event.target.value)}
            placeholder="Verify Time"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Attendance Status</Label>
          <select
            value={statusId}
            disabled={isViewMode}
            onChange={(event) => setStatusId(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
          >
            {/* <option value="">Select Status</option> */}
            {attendanceStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
