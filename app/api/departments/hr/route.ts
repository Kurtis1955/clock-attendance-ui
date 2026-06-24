import { queryService} from "@/services/ApiBaseService";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

export const GET = async (
  request: any,
) => {

 
  const urlData = new URL(request.url);

  const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());


  const queryParams = new URLSearchParams(queryParamsObject).toString();

  // console.log("queryParamsString@@>>", decodeURIComponent(queryParams));

  let urlExchange = `/users/company/hr?${decodeURIComponent(queryParams)}`;

    // console.log("urlExchange>>hr Department",urlExchange)

  const res = await queryService(`${urlExchange}`);

  return res;
};
