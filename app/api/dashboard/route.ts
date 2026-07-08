import  { queryDeviceAttendanceService }  from "@/services/ApiBaseService";

export const GET = async ( request:any) => {
	const urlData = new URL(request.url);
  
	const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
	const queryParams = new URLSearchParams(queryParamsObject).toString();
	const url=`/stats/dashboard?${decodeURIComponent(queryParams)}`

	const res = await queryDeviceAttendanceService(url);
	return res;
};

