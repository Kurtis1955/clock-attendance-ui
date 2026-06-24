import query from "@/services/ApiBaseService";



export async function GET(
	{ params }: { params: { id: string } }
) {
	const keyClockUserId = params.id;

	const res = await query(
		`/users/${keyClockUserId}/from-keycloak`
	);
    return res
}


export async function PUT(request: Request,
	
) {
	
	const body = await request.json()
	const urlParams = new URL(request.url);
	const userId = urlParams.searchParams.get("id");
    const isEnabled=urlParams.searchParams.get("enabled");
  
	const res = await query(
		`/users/${userId}/enabled${isEnabled}`, {
		method: "PUT",
		// data: { ...body },
	}

	);
    return res
  }