import  {queryService }  from "@/services/ApiBaseService";

export const GET = async ( request:any) => {
	
	// const searchParams = new URL(request.url);
	// const page = searchParams.get('page') || 1;
	// const pageSize = searchParams.get('size') || 10; // Default to pageSize 10 if not provided
	// const searchParamsApi = searchParams.search
	// console.log("searchParamsApi>>",searchParamsApi)
	

	const urlData = new URL(request.url);
  
	// Get all query parameters as an object
	const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
	
	// Convert the query parameters object into a string
	const queryParams = new URLSearchParams(queryParamsObject).toString();
	
	console.log("queryParamsString>>", queryParams);

	console.log("queryParams>>",decodeURIComponent(queryParams))
	const url=`/roles/paginated?${decodeURIComponent(queryParams)}`
	console.log("url>>",url)
	const res = await queryService(url);
	return res;
};
