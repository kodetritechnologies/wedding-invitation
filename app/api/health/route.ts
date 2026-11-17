import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    const conn = await dbConnect();
    const isConnected = conn.connection.readyState === 1;

    return NextResponse.json({
      success: true,
      message: "Server and Database are healthy",
      database: {
        status: isConnected ? "connected" : "disconnected",
        name: conn.connection.name,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
