import { queryDeviceAttendanceService } from "@/services/ApiBaseService";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const url = `/users/${id}`;

  const res = await queryDeviceAttendanceService(`${url}`);
  return res;
};


export async function PUT(
	request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
	const body = await request.json();
	const res = await queryDeviceAttendanceService(
		`/users/${id}`, {
		method: "PUT",
		data: { ...body },
	}

	);
    return res


}
