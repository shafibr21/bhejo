import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/authenticate";

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Only agents can update their location
    if (auth.user.role !== "agent") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { latitude, longitude, parcelId } = await request.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Update agent's current location
    const locationUpdate = {
      agentId: auth.user.userId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timestamp: new Date(),
      parcelId: parcelId || null,
    };

    // Store location in agent_locations collection
    await db.collection("agent_locations").insertOne(locationUpdate);

    // Also update the agent's current location in users collection
    await db.collection("users").updateOne(
      { _id: { $oid: auth.user.userId } },
      {
        $set: {
          currentLocation: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            updatedAt: new Date(),
          },
        },
      }
    );

    // If parcelId is provided, update the parcel's current location
    if (parcelId) {
      await db.collection("parcels").updateOne(
        { _id: { $oid: parcelId } },
        {
          $set: {
            currentLocation: {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              updatedAt: new Date(),
            },
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      location: locationUpdate,
    });
  } catch (error) {
    console.error("Agent location update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const agentId = searchParams.get("agentId");
    const parcelId = searchParams.get("parcelId");

    const db = await getDatabase();

    if (agentId) {
      // Get specific agent's current location
      const agent = await db
        .collection("users")
        .findOne(
          { _id: { $oid: agentId }, role: "agent" },
          { projection: { currentLocation: 1, name: 1 } }
        );

      if (!agent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        agent: {
          _id: agent._id,
          name: agent.name,
          currentLocation: agent.currentLocation,
        },
      });
    }

    if (parcelId) {
      // Get parcel's current location (agent's location)
      const parcel = await db
        .collection("parcels")
        .findOne(
          { _id: { $oid: parcelId } },
          {
            projection: {
              currentLocation: 1,
              trackingNumber: 1,
              assignedAgent: 1,
            },
          }
        );

      if (!parcel) {
        return NextResponse.json(
          { error: "Parcel not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        parcel: {
          _id: parcel._id,
          trackingNumber: parcel.trackingNumber,
          assignedAgent: parcel.assignedAgent,
          currentLocation: parcel.currentLocation,
        },
      });
    }

    // Get all active agents' locations (admin only)
    if (auth.user.role === "admin") {
      const agents = await db
        .collection("users")
        .find(
          { role: "agent" },
          { projection: { name: 1, currentLocation: 1 } }
        )
        .toArray();

      return NextResponse.json({
        success: true,
        agents: agents.filter((agent) => agent.currentLocation),
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Get agent location error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
