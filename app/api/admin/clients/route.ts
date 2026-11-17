import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Client from "@/models/Client";
import { getAuthUser } from "@/lib/auth";

// GET /api/admin/clients - List clients belonging to logged-in Admin
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "active";

    // Strict tenant isolation: query MUST include adminId
    const query: Record<string, unknown> = {
      adminId: auth.userId,
    };

    if (status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch clients";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/admin/clients - Create a new client
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, address, notes } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Client name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create client linked explicitly to auth.userId
    const newClient = await Client.create({
      adminId: auth.userId,
      name: name.trim(),
      email: email?.trim().toLowerCase() || undefined,
      phone: phone?.trim() || undefined,
      address: address?.trim() || undefined,
      notes: notes?.trim() || undefined,
      status: "active",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Client created successfully",
        client: newClient,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create client";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
