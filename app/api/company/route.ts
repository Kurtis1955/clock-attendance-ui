import { queryService } from "@/services/ApiBaseService";

export const GET = async (request: Request) => {
  const urlData = new URL(request.url);
  const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
  const queryParams = new URLSearchParams(queryParamsObject).toString();
  const url = queryParams ? `/getCompanies?${decodeURIComponent(queryParams)}` : "/companies";

  const res = await queryService(url);

  return res;
};
