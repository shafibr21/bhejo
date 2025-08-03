"use client";

import { BookParcelForm } from "@/components/forms/BookParcelForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, QrCode } from "lucide-react";
import { useState } from "react";
import { QRCodeDisplay } from "@/components/parcels/QRCodeDisplay";

export default function BookParcel() {
  const [bookedParcel, setBookedParcel] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleBookingSuccess = (parcel: any) => {
    setBookedParcel(parcel);
  };

  if (bookedParcel) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Parcel Booked Successfully!
            </CardTitle>
            <CardDescription>
              Your parcel has been registered for pickup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Booking Details:</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Tracking Number:</strong>{" "}
                  {(bookedParcel as any).trackingNumber}
                </p>
                <p>
                  <strong>Sender:</strong> {(bookedParcel as any).senderName}
                </p>
                <p>
                  <strong>Recipient:</strong>{" "}
                  {(bookedParcel as any).recipientName}
                </p>
                <p>
                  <strong>Status:</strong> Pending Pickup
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setBookedParcel(null)}
                className="text-blue-600 hover:underline"
              >
                Book Another Parcel
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <QrCode className="h-4 w-4" />
                {showQRCode ? "Hide" : "Show"} QR Code
              </button>
            </div>

            {showQRCode && (
              <div className="mt-6">
                <QRCodeDisplay
                  trackingNumber={(bookedParcel as any).trackingNumber}
                  parcelData={{
                    _id: (bookedParcel as any)._id,
                    senderName: (bookedParcel as any).senderName,
                    recipientName: (bookedParcel as any).recipientName,
                    status: "pending",
                  }}
                  size="md"
                  showDownload={true}
                  showShare={true}
                  className="border-0 shadow-none"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book a Parcel</h1>
        <p className="text-gray-600">
          Schedule a pickup for your parcel delivery
        </p>
      </div>

      <BookParcelForm onSuccess={handleBookingSuccess} />
    </div>
  );
}
