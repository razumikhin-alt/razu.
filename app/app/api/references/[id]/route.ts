import { authorize, reference } from "@/server/store";
import { errorResponse } from "@/server/browser";
import { buildDetails } from "@/server/reference-details";
export const dynamic="force-dynamic";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const owner=await authorize(request.headers);
    const row=await reference((await params).id,owner.id);
    return Response.json(buildDetails(row.analysis?JSON.parse(row.analysis):null),{headers:{"Cache-Control":"private, no-store","Vary":"Cookie, Authorization, OAI-Sites-Authorization"}});
  }catch(error){return errorResponse(error);}
}
