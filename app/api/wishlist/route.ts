import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Wishlist from "@/models/Wishlist";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const identifierParam = searchParams.get("identifier");

    const user = getAuthUser(req);
    const identifier =
      user?.userId ||
      identifierParam ||
      req.cookies.get("vv_visitor_id")?.value;

    if (!identifier) {
      return NextResponse.json({ success: true, likedSlugs: [] });
    }

    const items = await Wishlist.find({ identifier }).select("templateSlug").lean();
    const likedSlugs = items.map((i: any) => i.templateSlug);

    return NextResponse.json({
      success: true,
      likedSlugs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}
