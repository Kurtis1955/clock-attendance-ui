import { queryService } from "@/services/ApiBaseService";

export async function PUT(
	request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const res = await queryService(`/roles/${id}/default-permissions`, {
    method: "PUT",
    data: body,
  });

  return res;
}

