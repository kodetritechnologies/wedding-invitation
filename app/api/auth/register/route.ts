import { NextRequest } from "next/server";
import { POST as adminRegister } from "../admin/register/route";

export async function POST(req: NextRequest) {
  return adminRegister(req);
}
