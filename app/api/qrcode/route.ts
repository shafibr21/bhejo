import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authenticateRequest } from "@/lib/authenticate";
import { generateTrackingQRCode } from "@/utils/generateQRCode";

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      parcelId,
      trackingNumber,
      email,
      includeDetails = false,
    } = await request.json();

    if (!parcelId && !trackingNumber) {
      return NextResponse.json(
        { error: "Parcel ID or tracking number is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    let parcel = null;

    // Get parcel data
    if (parcelId) {
      parcel = await db
        .collection("parcels")
        .findOne({ _id: new ObjectId(parcelId) });
    } else if (trackingNumber) {
      parcel = await db.collection("parcels").findOne({ trackingNumber });
    }

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    // Check permissions
    if (auth.user.role === "customer" && parcel.senderId !== auth.user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Generate QR code
    const baseUrl = request.nextUrl.origin;
    const qrCodeDataUrl = await generateTrackingQRCode(
      parcel.trackingNumber,
      baseUrl,
      {
        width: 300,
        height: 300,
        errorCorrectionLevel: "M",
      }
    );

    const response = {
      success: true,
      qrCode: qrCodeDataUrl,
      trackingNumber: parcel.trackingNumber,
      trackingUrl: `${baseUrl}/customer/tracking?trackingNumber=${parcel.trackingNumber}`,
    };

    // If email is provided, send QR code via email
    if (email) {
      // TODO: Implement email sending logic
      // This would typically use a service like SendGrid, Nodemailer, etc.
      console.log(`QR code would be sent to: ${email}`);

      // For now, just return success
      return NextResponse.json({
        ...response,
        emailSent: true,
        emailAddress: email,
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("QR Code generation error:", error);
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
    const trackingNumber = searchParams.get("trackingNumber");

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Tracking number is required" },
        { status: 400 }
      );
    }

    // Generate QR code without storing
    const baseUrl = request.nextUrl.origin;
    const qrCodeDataUrl = await generateTrackingQRCode(
      trackingNumber,
      baseUrl,
      {
        width: 256,
        height: 256,
        errorCorrectionLevel: "M",
      }
    );

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      trackingNumber,
      trackingUrl: `${baseUrl}/customer/tracking?trackingNumber=${trackingNumber}`,
    });
  } catch (error) {
    console.error("QR Code generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
