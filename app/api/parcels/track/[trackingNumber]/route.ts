import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { trackingNumber } = await params;
    const db = await getDatabase();
    const parcel = await db.collection("parcels").findOne({
      trackingNumber: trackingNumber,
    });

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json(parcel);
  } catch (error) {
    console.error("Track parcel error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
