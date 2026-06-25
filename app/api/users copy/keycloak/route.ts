import  query  from "@/services/ApiBaseService";

export const GET = async ( request: Request,) => {
	
	const {searchParams} = new URL(request.url);
	 const querySearch = searchParams.get('q')
	const res = await query(`/users/search-keycloak?q${querySearch}`);
	return res;
};


