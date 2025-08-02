import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { authenticateRequest } from "@/lib/authenticate"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const parcel = await db.collection("parcels").findOne({ _id: new ObjectId(id) })

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 })
    }

    return NextResponse.json(parcel)
  } catch (error) {
    console.error("Get parcel error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(request)
    
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const updateData = await request.json()

    const db = await getDatabase()

    const result = await db.collection("parcels").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update parcel error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
