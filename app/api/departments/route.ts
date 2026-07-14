import { queryService } from "@/services/ApiBaseService";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const companyCode = searchParams.get("code") ?? searchParams.get("name");

  if (!companyCode) {
    return new Response(
      JSON.stringify({ message: "Company code is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const res = await queryService(
    `/company/department?company=${encodeURIComponent(companyCode)}`
  );

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
