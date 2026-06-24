import { queryService } from "@/services/ApiBaseService";

export const GET = async (	request: Request) => {

 
    const url=  `/roles/get_all_active_roles `
  
    const res = await queryService(url);
    return res
};

