import { queryService } from "@/services/ApiBaseService";
import { NextApiResponse } from "next";

export const GET = async (request:any,response:NextApiResponse) => {


    const urlData = new URL(request.url);
  
	// Get all query parameters as an object
	const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
	
	// Convert the query parameters object into a string
	const queryParams = new URLSearchParams(queryParamsObject).toString();
	
	// console.log("queryParamsString@active-directory>>", decodeURIComponent(queryParams));
    const url=  `/users/active-directory?${decodeURIComponent(queryParams)}`
  

	const res = await queryService(`${url}`);

	return res;
};