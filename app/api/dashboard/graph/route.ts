import  query, { queryService }  from "@/services/ApiBaseService";

export const GET = async ( request:any) => {
	const urlData = new URL(request.url);
  
	const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
	const queryParams = new URLSearchParams(queryParamsObject).toString();
	const url=`/dashboard/graph?${decodeURIComponent(queryParams)}`

	const res = await queryService(url);
	return res;
};

