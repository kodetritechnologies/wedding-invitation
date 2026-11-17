import { NextRequest, NextResponse } from "next/server";
import { getAuthAdmin, getAuthSuperAdmin, AuthTokenPayload } from "./auth";

export type AuthContext = {
  user: AuthTokenPayload;
};

// Guard for routes requiring Admin authentication
export function requireAdmin(
  req: NextRequest,
  handler: (req: NextRequest, ctx: AuthContext) => Promise<NextResponse>
) {
  const user = getAuthAdmin(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Admin authentication required" },
      { status: 401 }
    );
  }

  return handler(req, { user });
}

// Guard for routes requiring Super Admin authentication
export function requireSuperAdmin(
  req: NextRequest,
  handler: (req: NextRequest, ctx: AuthContext) => Promise<NextResponse>
) {
  const user = getAuthSuperAdmin(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Super Admin access required" },
      { status: 403 }
    );
  }

  return handler(req, { user });
}
