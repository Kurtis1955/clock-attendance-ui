import { queryDeviceAttendanceService } from "@/services/ApiBaseService";

export async function POST(request: Request) {
  const body = await request.json();
  const res = await queryDeviceAttendanceService(`/manual-attendance`, {
    method: "POST",
    data: { ...body },
  });
  return res;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
//   const { searchParams } = new URL(request.url);
  const { id } = await params;

  const body = await request.json();

  // console.log("body@@role edit",body)
  const res = await queryDeviceAttendanceService(`/manual-attendance/${id}`, {
    method: "PUT",
    data: { ...body },
  });
  return res;
}

// method to communicate with our backend services which
// returns the response for the frontend to use
export const GET = async (request: Request) => {
  const urlData = new URL(request.url);

  // Get all query parameters as an object
  const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());

  // Convert the query parameters object into a string
  const queryParams = new URLSearchParams(queryParamsObject).toString();

  const url = `/manual-attendance?${decodeURIComponent(queryParams)}`;

  const res = await queryDeviceAttendanceService(url);
  return res;
};
