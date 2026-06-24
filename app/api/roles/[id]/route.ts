import query, {queryService}from "@/services/ApiBaseService";

export async function GET(request: any,
    { params }: { params: { id: string } }
) {
	const roleId = params.id;

	const res = await queryService(
		`/roles/${roleId}`
	);
    return res
}

export async function PUT(request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
	const body = await request.json()


	const { id } = await params;
  
	const res = await queryService(
		`/roles/${id}`, {
		method: "PUT",
		 data: { ...body },
	}

	);
	console.log("Calling put")
    return res
  }




  export async function DELETE(request: Request,

    { params }: { params: { id: string } }
  ) {
	const roleId = params.id;
  
	const res = await queryService(
		`/roles/${roleId}`, {
		method: "DELETE"
	}

	);
    return res
  }
  