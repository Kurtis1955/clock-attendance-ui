import { queryDeviceAttendanceService} from "@/services/ApiBaseService";



export async function POST(
    request: Request,
) {

    const body = await request.json();
    const res = await queryDeviceAttendanceService(
        `/reports/attendance/log`, {
        method: "POST",
        data: { ...body },
    }

    );
    return res
}

