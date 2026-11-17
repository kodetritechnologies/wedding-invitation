import { NextRequest } from "next/server";
import { GET as adminMe } from "../admin/me/route";

export async function GET(req: NextRequest) {
  return adminMe(req);
}
