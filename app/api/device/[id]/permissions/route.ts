import { queryService } from "@/services/ApiBaseService";

export const GET = async (
  request: any,
  { params }: { params: { id: string } }
) => {
  const url = `/roles/${params.id}/permissions`;

  // console.log("url put role", url);
  const res = await queryService(`${url}`);

  return res;
};
