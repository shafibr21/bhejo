"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Truck,
  QrCode,
} from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/parcelStatus";
import { QRCodeDisplay } from "@/components/parcels/QRCodeDisplay";
import type { Parcel } from "@/types/parcel";

interface ParcelCardProps {
  parcel: Parcel;
  onTrack?: (parcel: Parcel) => void;
  onUpdateStatus?: (parcel: Parcel) => void;
  showActions?: boolean;
  showQRCode?: boolean;
}

export function ParcelCard({
  parcel,
  onTrack,
  onUpdateStatus,
  showActions = true,
  showQRCode = true,
}: ParcelCardProps) {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-4 w-4" />
            {parcel.trackingNumber}
          </CardTitle>
          <Badge
            className={
              STATUS_COLORS[parcel.status as keyof typeof STATUS_COLORS]
            }
          >
            {STATUS_LABELS[parcel.status as keyof typeof STATUS_LABELS]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-1">
              <User className="h-3 w-3" />
              Sender
            </h4>
            <p className="text-sm text-gray-600">{parcel.senderName}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {parcel.senderPhone}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Recipient
            </h4>
            <p className="text-sm text-gray-600">{parcel.recipientName}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {parcel.recipientPhone}
            </p>
            {parcel.recipientEmail && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {parcel.recipientEmail}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Type:</span> {parcel.parcelType}
          </div>
          <div>
            <span className="font-medium">Weight:</span> {parcel.weight} kg
          </div>
          <div>
            <span className="font-medium">Payment:</span>{" "}
            {parcel.paymentType.toUpperCase()}
            {parcel.paymentType === "cod" &&
              parcel.codAmount &&
              ` (₹${parcel.codAmount})`}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Created: {formatDate(parcel.createdAt)}
          </div>
          {parcel.assignedAgent && (
            <div className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Agent: {parcel.agentName}
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            {onTrack && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTrack(parcel)}
              >
                Track
              </Button>
            )}
            {onUpdateStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(parcel)}
              >
                Update Status
              </Button>
            )}
            {showQRCode && (
              <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-1" />
                    QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>QR Code - {parcel.trackingNumber}</DialogTitle>
                    <DialogDescription>
                      Scan to track this parcel
                    </DialogDescription>
                  </DialogHeader>
                  <QRCodeDisplay
                    trackingNumber={parcel.trackingNumber}
                    parcelData={{
                      _id: parcel._id,
                      senderName: parcel.senderName,
                      recipientName: parcel.recipientName,
                      status: parcel.status,
                    }}
                    size="md"
                    showDownload={true}
                    showShare={true}
                    className="border-0 shadow-none"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
