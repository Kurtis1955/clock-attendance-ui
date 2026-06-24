import { queryService} from "@/services/ApiBaseService";



export async function POST(
	request: Request,
) {

	const body = await request.json();
	const res = await queryService(
		`/roles`, {
		method: "POST",
		data: { ...body },
	}

	);
    return res


}

export async function PUT(
	request: Request,
) {
	const { searchParams } = new URL(request.url);
	const roleId = searchParams.get('id') || null
	
	const body = await request.json();

	// console.log("body@@role edit",body)
	const res = await queryService(
		`/roles/${roleId}`, {
		method: "PUT",
		data: { ...body },
	}

	);
    return res

}

export const GET = async (	request: Request) => {

 
    const urlData = new URL(request.url);
  
	// Get all query parameters as an object
	const queryParamsObject = Object.fromEntries(urlData.searchParams.entries());
	
	// Convert the query parameters object into a string
	const queryParams = new URLSearchParams(queryParamsObject).toString();
	
    const url=  `/roles?${decodeURIComponent(queryParams)}`
  
	const res = await queryService(url);
	return res
};




// export async function POST(
// 	request: Request,
// ) {

// 	const body = await request.json();
// 	const res = await queryAdminService(
// 		`/roles`, {
// 		method: "POST",
// 		data: { ...body },
// 	}

// 	);
//     return res


// }
