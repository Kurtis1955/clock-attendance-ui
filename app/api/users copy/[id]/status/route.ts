import { queryService } from "@/services/ApiBaseService";

export const PUT = async (
  request: any,
  { params }: { params: { id: string } }
) => {

  const { id } = await params;
  const urlData = new URL(request.url);
  const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
  const queryParams = new URLSearchParams(queryParamsObject).toString();

  // console.log("queryParamsString>>", decodeURIComponent(queryParams));

  const url = `/users/${id}/enable?${decodeURIComponent(queryParams)}`
 console.log("URL DEV>>",url)
  const res = await queryService(`${url}`,{
    method:"PUT"
  });

  return res;
};
