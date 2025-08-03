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

    if (auth.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { parcelId, agentId } = await request.json();

    const db = await getDatabase();

    // Get agent details
    const agent = await db
      .collection("users")
      .findOne({ _id: new ObjectId(agentId) });
    if (!agent || agent.role !== "agent") {
      return NextResponse.json({ error: "Invalid agent" }, { status: 400 });
    }

    // Update parcel
    const result = await db.collection("parcels").updateOne(
      { _id: new ObjectId(parcelId) },
      {
        $set: {
          assignedAgent: agentId,
          agentName: agent.name,
          status: "assigned",
          updatedAt: new Date(),
        },
        $push: {
          statusHistory: {
            status: "assigned",
            timestamp: new Date(),
            notes: `Assigned to agent: ${agent.name}`,
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

    // Emit real-time updates via Socket.IO
    const socketService = getSocketService();
    if (socketService && updatedParcel) {
      // Emit to the assigned agent
      socketService.emitParcelAssignment(parcelId, agentId, updatedParcel);

      // Emit general parcel update
      socketService.emitParcelUpdate({
        parcelId,
        status: "assigned",
        timestamp: new Date(),
        parcel: updatedParcel,
        agentId,
        customerId: updatedParcel.senderId,
      });
    }

    return NextResponse.json({ success: true, parcel: updatedParcel });
  } catch (error) {
    console.error("Assign agent error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
