import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/authenticate";

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const db = await getDatabase();
    const query: any = {};

    // Filter based on user role
    if (auth.user.role === "customer") {
      query.senderId = auth.user.userId;
    } else if (auth.user.role === "agent") {
      query.assignedAgent = auth.user.userId;
    }
    // Admin can see all parcels (no additional filter)

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const parcels = await db
      .collection("parcels")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("parcels").countDocuments(query);

    return NextResponse.json({
      parcels,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get parcels error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const parcelData = await request.json();

    const db = await getDatabase();

    // Generate tracking number
    const trackingNumber = `CP${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const newParcel = {
      ...parcelData,
      trackingNumber,
      senderId: auth.user.userId,
      status: "pending",
      assignedAgent: null,
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date(),
          notes: "Parcel booking created",
          updatedBy: auth.user.userId,
        },
      ],
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("parcels").insertOne(newParcel as any);

    return NextResponse.json({
      parcel: { ...newParcel, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Create parcel error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
