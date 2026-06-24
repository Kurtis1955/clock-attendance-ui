import { queryService } from "@/services/ApiBaseService";

export const GET = async (
  request: any,
  { params }: { params: { id: string } }
) => {
  const url = `/users/${params.id}/permissions/user`;


  const res = await queryService(`${url}`);

  return res;
};
