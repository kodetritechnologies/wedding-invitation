import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Client from "@/models/Client";
import Wedding from "@/models/Wedding";
import { getAuthUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/clients/[id] - Get single client details and their weddings
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    // Verify ownership: must match id AND adminId
    const client = await Client.findOne({ _id: id, adminId: auth.userId });
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found or unauthorized" },
        { status: 404 }
      );
    }

    // Also fetch weddings associated with this client
    const weddings = await Wedding.find({
      clientId: id,
      adminId: auth.userId,
    }).sort({ weddingDate: 1 });

    return NextResponse.json({
      success: true,
      client,
      weddings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch client";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT /api/admin/clients/[id] - Update client
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { name, email, phone, address, notes, status } = body;

    await dbConnect();

    const client = await Client.findOne({ _id: id, adminId: auth.userId });
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found or unauthorized" },
        { status: 404 }
      );
    }

    if (name) client.name = name.trim();
    if (email !== undefined) client.email = email ? email.trim().toLowerCase() : undefined;
    if (phone !== undefined) client.phone = phone ? phone.trim() : undefined;
    if (address !== undefined) client.address = address ? address.trim() : undefined;
    if (notes !== undefined) client.notes = notes ? notes.trim() : undefined;
    if (status && ["active", "archived"].includes(status)) client.status = status;

    await client.save();

    return NextResponse.json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update client";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/admin/clients/[id] - Archive/delete client
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const client = await Client.findOne({ _id: id, adminId: auth.userId });
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found or unauthorized" },
        { status: 404 }
      );
    }

    // Instead of hard deleting, we archive to protect wedding history
    client.status = "archived";
    await client.save();

    return NextResponse.json({
      success: true,
      message: "Client archived successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete client";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
