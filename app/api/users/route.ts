import  query, { queryService }  from "@/services/ApiBaseService";

export const GET = async (request:any) => {

	const urlData = new URL(request.url);
  
	// Get all query parameters as an object
	const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
	
	// Convert the query parameters object into a string
	const queryParams = new URLSearchParams(queryParamsObject).toString();

	const res = await queryService(`/users?${decodeURIComponent(queryParams)}`);
	return res;
};

export async function POST(
	request: Request,
) {

	const body = await request.json();

	const res = await queryService(
		`/users`, {
		method: "POST",
		data: { ...body },
	}

	);
    return res


}

// export async function PUT(request: Request,
	
// ) {
	
// 	const body = await request.json()
// 	const urlParams = new URL(request.url);
// 	const userId = urlParams.searchParams.get("id");
  
// 	const res = await query(
// 		`/users/${userId}`, {
// 		method: "PUT",
// 		data: { ...body },
// 	}

// 	);
//     return res
//   }

//   export async function DELETE(request: Request) {
// 	const urlParams = new URL(request.url);
// 	const userId = urlParams.searchParams.get("id");
  
// 	const res = await query(
// 		`/users/${userId}`, {
// 		method: "DELETE"
// 	}

// 	);
//     return res
//   }
  