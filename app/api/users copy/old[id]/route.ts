import {queryService} from "@/services/ApiBaseService";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const userId = params.id;

	const res = await queryService(
		`/users/${userId}`
	);
    return res
}

export async function PUT(request: Request,
    { params }: { params: { id: string } }
) {
	const body = await request.json()
	const userId = params.id;
  
	const res = await queryService(
		`/users/${userId}/`, {
		method: "PUT",
		 data: { ...body },
	}

	);
    return res
  }


  export async function DELETE(request: Request,

    { params }: { params: { id: string } }
  ) {
	const userId = params.id;
  
	const res = await queryService(
		`/users/${userId}`, {
		method: "DELETE"
	}

	);
    return res
  }
  