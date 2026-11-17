import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export type UserRole = "super_admin" | "admin";

const JWT_SECRET = process.env.JWT_SECRET || "shaadiconnect_jwt_secret_dev_key";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

// Hash password with salt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare plain password with hash
export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// Generate JWT token (default: 7 days validity)
export function signToken(
  payload: AuthTokenPayload,
  expiresIn: string | number = "7d"
): string {
  // @ts-expect-error jsonwebtoken types signature compatibility
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verify JWT token
export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

// Extract Admin payload (checks Authorization header, admin_token, or auth_token cookie)
export function getAuthAdmin(req: NextRequest): AuthTokenPayload | null {
  // 1. Check Bearer token
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const verified = verifyToken(token);
    if (verified && verified.role === "admin") return verified;
  }

  // 2. Check cookies: admin_token first, then auth_token
  const cookieToken =
    req.cookies.get("admin_token")?.value ||
    req.cookies.get("auth_token")?.value;

  if (cookieToken) {
    const verified = verifyToken(cookieToken);
    if (verified && verified.role === "admin") return verified;
  }

  return null;
}

// Extract Super Admin payload (checks Authorization header or super_admin_token cookie)
export function getAuthSuperAdmin(req: NextRequest): AuthTokenPayload | null {
  // 1. Check Bearer token
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const verified = verifyToken(token);
    if (verified && verified.role === "super_admin") return verified;
  }

  // 2. Check cookie: super_admin_token
  const cookieToken = req.cookies.get("super_admin_token")?.value;
  if (cookieToken) {
    const verified = verifyToken(cookieToken);
    if (verified && verified.role === "super_admin") return verified;
  }

  return null;
}

// Generic user extraction
export function getAuthUser(req: NextRequest): AuthTokenPayload | null {
  return getAuthAdmin(req) || getAuthSuperAdmin(req);
}
