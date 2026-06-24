import { queryService } from "@/services/ApiBaseService";

export const GET = async (	request: Request) => {

 
    const res = await queryService(`/departments`);

    return res;
};
