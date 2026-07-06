import { queryService } from "@/services/ApiBaseService";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const url = `/users/username/${id}`;

  const res = await queryService(`${url}`);
  return res;
};


export async function PUT(
	request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
	const body = await request.json();
	const res = await queryService(
		`/users/${id}`, {
		method: "PUT",
		data: { ...body },
	}

	);
    return res


}
