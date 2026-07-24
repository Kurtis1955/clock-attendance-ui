import  {queryService}  from "@/services/ApiBaseService";

export const GET = async ( request: Request,) => {
	
	const urlData = new URL(request.url);
  
	// Get all query parameters as an object
	const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
	
	// Convert the query parameters object into a string
	const queryParams = new URLSearchParams(queryParamsObject).toString();
	
	console.log("queryParamsString>>", queryParams);

	console.log("queryParams>>",decodeURIComponent(queryParams))
	const url=`/users/paginated?${decodeURIComponent(queryParams)}`
	const res = await queryService(url);
	return res;
};
