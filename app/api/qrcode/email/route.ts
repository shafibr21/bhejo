import { type NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/authenticate";
import { generateTrackingQRCode } from "@/utils/generateQRCode";
import { sendQRCodeEmail, sendBulkQRCodeEmails } from "@/services/emailService";
import { getDatabase } from "@/lib/mongodb";

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
      trackingNumbers,
      emailType = "recipient",
      emails,
    } = await request.json();

    if (!trackingNumbers || trackingNumbers.length === 0) {
      return NextResponse.json(
        { error: "No tracking numbers provided" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const parcels = await db
      .collection("parcels")
      .find({
        trackingNumber: { $in: trackingNumbers },
      })
      .toArray();

    if (parcels.length === 0) {
      return NextResponse.json({ error: "No parcels found" }, { status: 404 });
    }

    const baseUrl = request.nextUrl.origin;
    const parcelsWithQR = [];

    // Generate QR codes and prepare email data
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

        // Use provided emails or fall back to parcel emails
        const recipientEmail =
          emails?.[parcel.trackingNumber]?.recipient || parcel.recipientEmail;
        const senderEmail =
          emails?.[parcel.trackingNumber]?.sender || parcel.senderEmail;

        parcelsWithQR.push({
          recipientEmail,
          senderEmail,
          trackingNumber: parcel.trackingNumber,
          recipientName: parcel.recipientName,
          senderName: parcel.senderName,
          status: parcel.status,
          qrCode: qrCodeDataUrl,
          trackingUrl: `${baseUrl}/customer/tracking?trackingNumber=${parcel.trackingNumber}`,
        });
      } catch (error) {
        console.error(
          `Failed to generate QR for ${parcel.trackingNumber}:`,
          error
        );
      }
    }

    if (parcelsWithQR.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate QR codes" },
        { status: 500 }
      );
    }

    // Send emails
    const emailResults = await sendBulkQRCodeEmails({
      parcels: parcelsWithQR,
      emailType: emailType as "recipient" | "sender" | "both",
    });

    return NextResponse.json({
      success: true,
      totalParcels: parcels.length,
      emailResults,
    });
  } catch (error) {
    console.error("Email QR Code error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
