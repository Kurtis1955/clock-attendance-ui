import {queryService} from "@/services/ApiBaseService";

export const GET = async (request: Request,) => {

	const {searchParams} = new URL(request.url);
	 const email = searchParams.get('email')
	const res = await queryService(`/users/by-email/${email}/exist`);

	return res;
};