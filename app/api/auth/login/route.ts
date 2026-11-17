import { NextRequest } from "next/server";
import { POST as adminLogin } from "../admin/login/route";

export async function POST(req: NextRequest) {
  return adminLogin(req);
}
