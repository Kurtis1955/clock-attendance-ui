import  query, { queryService }  from "@/services/ApiBaseService";

export const GET = async (request:any) => {

    const urlData = new URL(request.url);
  
    // Get all query parameters as an object
    const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
    
    // Convert the query parameters object into a string
    const queryParams = new URLSearchParams(queryParamsObject).toString();

    const res = await queryService(`/users/department/search?${decodeURIComponent(queryParams)}`);
    return res;
};