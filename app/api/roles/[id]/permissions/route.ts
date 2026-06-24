import { queryService } from "@/services/ApiBaseService";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const url = `/roles/${id}/permissions`;

  const res = await queryService(`${url}`);

  return res;
};
