import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword, signJWT } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, phone, address } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || "",
      address: address || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)

    const token = signJWT({
      userId: result.insertedId.toString(),
      email,
      role,
    })

    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      token,
      user: { ...userWithoutPassword, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
