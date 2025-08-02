import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { authenticateRequest } from "@/lib/authenticate"

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
    }

    const { parcelId, status, location, notes } = await request.json()

    const db = await getDatabase()

    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (location) {
      updateData.currentLocation = location
    }

    if (status === "delivered") {
      updateData.deliveryDate = new Date()
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
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
