"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
export default function AddEditAttendant({
  actionType,
  existingAttendantData,
  callback,
  onClose,
}: any) {
  
  const [userId, setUserId] = useState(existingAttendantData?.id || existingAttendantData?.userId || "");
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
  const [userPhone, setUserPhone] = useState(
    existingAttendantData?.phone || "",
  );
  const [attendanceDate, setAttendanceDate] = useState(
    existingAttendantData?.verifyTime
      ? existingAttendantData.verifyTime.split("T")[0]
      : "",
  );
  const [appointmentTime, setAppointmentTime] = useState(
    existingAttendantData?.verifyTime
      ? existingAttendantData.verifyTime.split("T")[1]
      : "",
  );
  const [errorMessage, setErrorMessage] = useState("");
  // const [verifyTime, setVerifyTime] = useState(
  //   existingAttendantData?.verifyTime || "",
  // );
  const [statusId, setStatusId] = useState(
    existingAttendantData?.statusId || "",
  );
  const [attendanceStatusOptions, setAttendanceStatusOptions] = useState<any[]>(
    [],
  );
  const isViewMode = actionType === "view";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("existingAttendantData >>", existingAttendantData);
    setUserId(existingAttendantData?.id || "");
    setFirstName(existingAttendantData?.firstName || "");
    setLastName(existingAttendantData?.lastName || "");
    setUserEmail(existingAttendantData?.email || "");
    setUserEcode(existingAttendantData?.e_code || "");
    setUserPhone(existingAttendantData?.phone || "");
    // setVerifyTime(existingAttendantData?.verifyTime || "");
    setStatusId(existingAttendantData?.statusId || "");
    setAttendanceDate(
      existingAttendantData.verifyTime
        ? existingAttendantData.verifyTime.split("T")[0]
        : "",
    );
    setAppointmentTime(
      existingAttendantData.verifyTime
        ? existingAttendantData.verifyTime.split("T")[1]
        : "",
    );
    if (actionType == "edit") {
      console.log("existingAttendantData id>>", existingAttendantData.userId);
      fetch(`/api/enrollment/${existingAttendantData?.userId}`)
        .then((response) => response.json())
        .then((data) => {
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setUserEmail(data.email || "");
          setUserEcode(data.e_code || "");
          setUserPhone(data.phone || "");
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
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
      setAttendanceStatusOptions(options || []);
    } catch (error) {
      console.error("Error fetching attendance status:", error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      event.preventDefault();
      const verifyDate = new Date(attendanceDate);

      const [hours, minutes] = appointmentTime.split(":");

      verifyDate.setHours(Number(hours));
      verifyDate.setMinutes(Number(minutes));
      verifyDate.setSeconds(0);
      verifyDate.setMilliseconds(0);

      const payload = {
        userId,
        statusId,
        verifyTime: verifyDate.toISOString(),
      };

      console.log("payload>>", payload);

      if (actionType === "edit") {
        const res = await fetch(`/api/attendance/manual-attendance`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Failed to update attendance");
        } else {
          const data = await res.json();
          console.log("data>>", data);
          callback(data);
          onClose();
        }
      } else {
        const res = await fetch(`/api/attendance/manual-attendance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Failed to add attendance");
        } else {
          const data = await res.json();
          console.log("data>>", data);
          callback(data);
          onClose();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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

        {/* <div className="space-y-1.5">
          <Label>Employee Phone</Label>
          <Input
            value={userPhone}
            disabled={isViewMode}
            onChange={(event) => setUserPhone(event.target.value)}
            placeholder="Employee Phone"
          />
        </div> */}

        <div className="space-y-1.5">
          <Label>Date</Label>
          <div className="w-full flex items-center gap-2">
            <div className="w-1/2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker-optional"
                    className="w-full justify-between py-4.5 text-sm"
                  >
                    {attendanceDate
                      ? format(attendanceDate, "PPP")
                      : "Select date"}
                    <ChevronDownIcon data-icon="inline-end" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={attendanceDate}
                    captionLayout="dropdown"
                    defaultMonth={attendanceDate}
                    onSelect={(date) => {
                      setAttendanceDate(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-1/2">
              <Input
                id="appointment-time"
                type="time"
                value={appointmentTime}
                onChange={(e) => {
                  setAppointmentTime(e.target.value);
                  setErrorMessage("");
                }}
                step="60"
                className="w-full h-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Attendance Status</Label>
          <select
            value={statusId}
            disabled={isViewMode}
            onChange={(event) => setStatusId(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">Select Status</option>
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
