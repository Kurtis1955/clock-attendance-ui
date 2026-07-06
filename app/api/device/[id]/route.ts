import { queryDeviceAttendanceService } from "@/services/ApiBaseService";

export async function GET(
  request: any,
  { params }: { params: { id: string } },
) {
  const roleId = params.id;

  const res = await queryDeviceAttendanceService(`/roles/${roleId}`);
  return res;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const res = await queryDeviceAttendanceService(`/devices/${id}/sync`, {
    method: "POST",
    data: { ...body },
  });
  return res;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const res = await queryDeviceAttendanceService(`/devices/${id}`, {
    method: "PUT",
    data: { ...body },
  });
  return res;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const res = await queryDeviceAttendanceService(`/devices/${id}/enabled`, {
    method: "PATCH",
    data: { ...body },
  });
  return res;
}

export async function DELETE(
  request: Request,

  { params }: { params: { id: string } },
) {
  const roleId = params.id;

  const res = await queryDeviceAttendanceService(`/roles/${roleId}`, {
    method: "DELETE",
  });
  return res;
}
