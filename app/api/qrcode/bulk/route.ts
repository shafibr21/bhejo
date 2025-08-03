import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
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

    // Only admins can do bulk generation
    if (auth.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { parcelIds, filters } = await request.json();

    const db = await getDatabase();
    let parcels = [];

    if (parcelIds && parcelIds.length > 0) {
      // Generate for specific parcels
      parcels = await db
        .collection("parcels")
        .find({ _id: { $in: parcelIds.map((id: string) => ({ $oid: id })) } })
        .toArray();
    } else if (filters) {
      // Generate based on filters
      const query: any = {};

      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
          query.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.createdAt.$lte = new Date(filters.dateTo);
        }
      }
      if (filters.assignedAgent) {
        query.assignedAgent = filters.assignedAgent;
      }

      parcels = await db.collection("parcels").find(query).limit(100).toArray();
    } else {
      // Get recent parcels
      parcels = await db
        .collection("parcels")
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
    }

    if (parcels.length === 0) {
      return NextResponse.json(
        { error: "No parcels found for bulk generation" },
        { status: 400 }
      );
    }

    const baseUrl = request.nextUrl.origin;
    const qrCodes = [];

    // Generate QR codes for all parcels
    for (const parcel of parcels) {
      try {
        const qrCodeDataUrl = await generateTrackingQRCode(
          parcel.trackingNumber,
          baseUrl,
          {
            width: 256,
            height: 256,
            errorCorrectionLevel: "M",
          }
        );

        qrCodes.push({
          parcelId: parcel._id,
          trackingNumber: parcel.trackingNumber,
          senderName: parcel.senderName,
          recipientName: parcel.recipientName,
          status: parcel.status,
          qrCode: qrCodeDataUrl,
          trackingUrl: `${baseUrl}/customer/tracking?trackingNumber=${parcel.trackingNumber}`,
        });
      } catch (error) {
        console.error(
          `Failed to generate QR for ${parcel.trackingNumber}:`,
          error
        );
        // Continue with other parcels
      }
    }

    return NextResponse.json({
      success: true,
      totalParcels: parcels.length,
      generatedQRCodes: qrCodes.length,
      qrCodes,
    });
  } catch (error) {
    console.error("Bulk QR Code generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
