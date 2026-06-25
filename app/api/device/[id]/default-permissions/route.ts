import { queryService } from "@/services/ApiBaseService";

export const PUT = async (
  request: any,
  { params }: { params: { id: string } }
) => {
  const url = `/roles/${params.id}/default-permissions`;
	const body = await request.json()

  	console.log("body>>>",body)
  // console.log("url put role", url);
  const res = await queryService(`${url}`,
    {
		method: "PUT",
		 data: body,
	}
  );

  return res;
};

