import  query  from "@/services/ApiBaseService";

export const GET = async ( request: Request,) => {

	const res = await query(`/roles/from-keycloak`);
	return res;
};


