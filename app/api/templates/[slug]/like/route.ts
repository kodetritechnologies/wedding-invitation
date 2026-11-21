import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Wishlist from "@/models/Wishlist";
import InvitationTemplate from "@/models/InvitationTemplate";
import { getAuthUser } from "@/lib/auth";

// Helper to determine visitor identifier
function getVisitorIdentifier(req: NextRequest, bodyIdentifier?: string): { identifier: string; userId?: string } {
  const user = getAuthUser(req);
  if (user?.userId) {
    return { identifier: user.userId, userId: user.userId };
  }
  if (bodyIdentifier && typeof bodyIdentifier === "string" && bodyIdentifier.trim().length > 0) {
    return { identifier: bodyIdentifier.trim() };
  }
  const cookieId = req.cookies.get("vv_visitor_id")?.value;
  if (cookieId) {
    return { identifier: cookieId };
  }
  // IP fallback
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous-visitor";
  return { identifier: `ip_${ip}` };
}

// GET /api/templates/[slug]/like - Get status & count
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const identifierParam = searchParams.get("identifier") || undefined;
    const { identifier } = getVisitorIdentifier(req, identifierParam);

    const template = await InvitationTemplate.findOne({ slug }).select("likesCount").lean();
    const count = template?.likesCount ?? (await Wishlist.countDocuments({ templateSlug: slug }));

    const existing = await Wishlist.findOne({ templateSlug: slug, identifier }).lean();

    return NextResponse.json({
      success: true,
      likesCount: Math.max(0, count),
      hasLiked: Boolean(existing),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch like status" },
      { status: 500 }
    );
  }
}

// POST /api/templates/[slug]/like - Toggle like
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    let bodyIdentifier: string | undefined;
    try {
      const body = await req.json();
      bodyIdentifier = body.identifier;
    } catch {
      // Body might be empty
    }

    const { identifier, userId } = getVisitorIdentifier(req, bodyIdentifier);

    // Check if already liked
    const existing = await Wishlist.findOne({ templateSlug: slug, identifier });

    let hasLiked: boolean;
    if (existing) {
      // Remove like
      await Wishlist.deleteOne({ _id: existing._id });
      hasLiked = false;
    } else {
      // Add like
      await Wishlist.create({
        templateSlug: slug,
        identifier,
        userId: userId || undefined,
      });
      hasLiked = true;
    }

    // Accurate count from Wishlist collection
    const actualCount = await Wishlist.countDocuments({ templateSlug: slug });

    // Update InvitationTemplate document
    await InvitationTemplate.updateOne(
      { slug },
      { $set: { likesCount: actualCount } }
    );

    const res = NextResponse.json({
      success: true,
      hasLiked,
      likesCount: actualCount,
      identifier,
    });

    // Ensure visitor cookie is stored if not present
    if (!req.cookies.get("vv_visitor_id")?.value) {
      res.cookies.set("vv_visitor_id", identifier, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        sameSite: "lax",
      });
    }

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to toggle like" },
      { status: 500 }
    );
  }
}
