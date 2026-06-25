import { queryService } from "@/services/ApiBaseService";

export const GET = async (
  request: any,
    { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const url = `/users/username/${id}`;


  const res = await queryService(`${url}`);

  return res;
};
