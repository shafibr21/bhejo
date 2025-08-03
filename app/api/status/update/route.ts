import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authenticateRequest } from "@/lib/authenticate";
import { getSocketService } from "@/services/socketService";

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { parcelId, status, location, notes } = await request.json();

    const db = await getDatabase();

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (location) {
      updateData.currentLocation = location;
    }

    if (status === "delivered") {
      updateData.deliveryDate = new Date();
    }

    const result = await db.collection("parcels").updateOne(
      { _id: new ObjectId(parcelId) },
      {
        $set: updateData,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            location,
            notes: notes || "",
            updatedBy: auth.user.userId,
          },
        } as any,
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    // Get updated parcel data for socket emission
    const updatedParcel = await db
      .collection("parcels")
      .findOne({ _id: new ObjectId(parcelId) });

    // Emit real-time update via Socket.IO
    const socketService = getSocketService();
    if (socketService && updatedParcel) {
      socketService.emitParcelUpdate({
        parcelId,
        status,
        timestamp: new Date(),
        parcel: updatedParcel,
        location,
        agentId: updatedParcel.assignedAgent,
        customerId: updatedParcel.senderId,
      });
    }

    return NextResponse.json({ success: true, parcel: updatedParcel });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
