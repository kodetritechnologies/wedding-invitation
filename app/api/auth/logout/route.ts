import { POST as adminLogout } from "../admin/logout/route";

export async function POST() {
  return adminLogout();
}
