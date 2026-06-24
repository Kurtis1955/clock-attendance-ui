import { queryService } from "@/services/ApiBaseService";

export const GET = async (	request: Request) => {

	const { searchParams } = new URL(request.url);
	const companyName = searchParams.get('name') 
	// console.log("URL>>@@@@",`/company/department?company=${companyName}`)
	const res = await queryService(`/company/department?company=${companyName}`);

	return res;
};

export const POST = async (request: Request) => {
  
        const body = await request.json();
        // You may want to perform validation here
        const res = await queryService(`/departments`, {
            method: "POST",
            data: { ...body },
        });
        return res;
   
};
