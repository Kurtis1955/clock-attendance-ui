import { queryService } from "@/services/ApiBaseService";

export const GET = async (
  request: any,
) => {

 
  const urlData = new URL(request.url);

  const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());


  const queryParams = new URLSearchParams(queryParamsObject).toString();

  // console.log("queryParamsString@@>>", decodeURIComponent(queryParams));

  let urlExchange = `/users/manager/department?${decodeURIComponent(queryParams)}`;

    // console.log("urlExchange>>hr Department",urlExchange)

  const res = await queryService(`${urlExchange}`);

  return res;
};
