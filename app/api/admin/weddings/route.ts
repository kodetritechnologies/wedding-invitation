import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import Admin from "@/models/Admin";
import { getAuthUser } from "@/lib/auth";

// Helper to sanitize slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/admin/weddings - List weddings belonging to logged-in Admin
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const query: Record<string, unknown> = {
      adminId: auth.userId,
    };

    if (clientId) query.clientId = clientId;
    if (status && status !== "all") query.status = status;

    const total = await Wedding.countDocuments(query);

    let weddingQuery = Wedding.find(query)
      .populate("clientId", "name phone email")
      .sort({ createdAt: -1 });

    if (pageParam || limitParam) {
      const page = Math.max(1, parseInt(pageParam || "1", 10));
      const limit = Math.max(1, Math.min(100, parseInt(limitParam || "10", 10)));
      const skip = (page - 1) * limit;
      weddingQuery = weddingQuery.skip(skip).limit(limit);

      const weddings = await weddingQuery;
      return NextResponse.json({
        success: true,
        count: weddings.length,
        weddings,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    }

    const weddings = await weddingQuery;

    return NextResponse.json({
      success: true,
      count: weddings.length,
      weddings,
      pagination: {
        total,
        page: 1,
        limit: weddings.length,
        totalPages: 1,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch weddings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/admin/weddings - Create a new wedding project
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      clientId,
      title,
      brideName,
      groomName,
      weddingDate,
      venue,
      city,
      slug: customSlug,
      story,
      familyMessage,
      contactPersons,
      packageTier,
      templateId,
      templateContent,
    } = body;

    // Required field validation
    if (!brideName || !groomName || !weddingDate || !venue) {
      return NextResponse.json(
        {
          success: false,
          error: "Bride name, Groom name, Wedding date, and Venue are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check plan quota limits
    const admin = await Admin.findById(auth.userId);
    if (admin) {
      const activeWeddingCount = await Wedding.countDocuments({
        adminId: auth.userId,
        status: { $ne: "archived" },
      });
      const limit = admin.subscription?.activeWeddingLimit || 1;
      if (activeWeddingCount >= limit) {
        return NextResponse.json(
          {
            success: false,
            error: `Plan limit reached. Your active plan allows up to ${limit} active wedding(s). Please upgrade to add more.`,
          },
          { status: 403 }
        );
      }
    }

    // Auto-generate title if not provided
    const weddingTitle = title?.trim() || `${brideName.trim()} & ${groomName.trim()} Wedding`;

    // Process unique slug
    let baseSlug = customSlug
      ? generateSlug(customSlug)
      : generateSlug(`${brideName}-${groomName}`);
    if (!baseSlug) baseSlug = `wedding-${Date.now()}`;

    let slug = baseSlug;
    let count = 1;
    while (await Wedding.exists({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const newWedding = await Wedding.create({
      adminId: auth.userId,
      clientId: clientId || undefined,
      title: weddingTitle,
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      weddingDate: new Date(weddingDate),
      venue: venue.trim(),
      city: city?.trim() || "Indore",
      slug,
      status: "draft",
      packageTier: packageTier || "basic",
      templateId: templateId || undefined,
      templateContent: templateContent || {},
      story: story?.trim() || undefined,
      familyMessage: familyMessage?.trim() || undefined,
      contactPersons: Array.isArray(contactPersons) ? contactPersons : [],
      settings: {
        allowPublicRsvp: true,
        showHeadcount: true,
        notifyOnRsvp: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Wedding project created successfully",
        wedding: newWedding,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create wedding";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
