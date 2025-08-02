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

    if (auth.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const db = await getDatabase();

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Daily bookings
    const dailyBookings = await db.collection("parcels").countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    // Total parcels
    const totalParcels = await db.collection("parcels").countDocuments();

    // Failed deliveries
    const failedDeliveries = await db.collection("parcels").countDocuments({
      status: "failed",
    });

    // COD amounts
    const codParcels = await db
      .collection("parcels")
      .find({
        paymentType: "cod",
        status: "delivered",
      })
      .toArray();

    const totalCodAmount = codParcels.reduce(
      (sum, parcel) => sum + (parcel.codAmount || 0),
      0
    );

    // Status distribution
    const statusStats = await db
      .collection("parcels")
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // Recent parcels
    const recentParcels = await db
      .collection("parcels")
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      dailyBookings,
      totalParcels,
      failedDeliveries,
      totalCodAmount,
      statusStats,
      recentParcels,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
