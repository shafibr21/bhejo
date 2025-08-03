"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode, Mail } from "lucide-react";
import { QRCodeDisplay } from "@/components/parcels/QRCodeDisplay";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  parcels?: Array<{
    _id: string;
    trackingNumber: string;
    senderName?: string;
    recipientName?: string;
    senderEmail?: string;
    status?: string;
  }>;
}

export function QRCodeGenerator({ parcels = [] }: QRCodeGeneratorProps) {
  const [selectedParcel, setSelectedParcel] = useState<string>("");
  const [customTracking, setCustomTracking] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const currentParcel = parcels.find((p) => p._id === selectedParcel);
  const trackingNumber = currentParcel?.trackingNumber || customTracking;

  const handleParcelSelect = (parcelId: string) => {
    setSelectedParcel(parcelId);
    // Clear custom tracking when selecting a parcel
    if (parcelId) {
      setCustomTracking("");
    }
  };

  const handleCustomTrackingChange = (value: string) => {
    setCustomTracking(value);
    // Clear parcel selection when typing custom tracking
    if (value.trim()) {
      setSelectedParcel("");
    }
  };

  const handleGenerateQR = () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Missing Tracking Number",
        description: "Please select a parcel or enter a tracking number",
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleEmailQR = async () => {
    if (!currentParcel || !currentParcel.senderEmail) {
      toast({
        title: "Email Not Available",
        description: "Sender email not found for this parcel",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/qrcode/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingNumbers: [currentParcel.trackingNumber],
          emailType: "sender",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send QR code via email");
      }

      toast({
        title: "Email Sent",
        description: `QR code sent to ${currentParcel.senderEmail}`,
      });
    } catch (error) {
      console.error("Email error:", error);
      toast({
        title: "Email Failed",
        description: "Failed to send QR code via email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate QR codes for individual parcels to enable easy tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Parcel Selection */}
        <div className="space-y-2">
          <Label htmlFor="parcel-select">Select Parcel</Label>
          <Select value={selectedParcel} onValueChange={handleParcelSelect}>
            <SelectTrigger className={customTracking ? "opacity-50" : ""}>
              <SelectValue placeholder="Choose a parcel..." />
            </SelectTrigger>
            <SelectContent>
              {parcels.map((parcel) => (
                <SelectItem key={parcel._id} value={parcel._id}>
                  {parcel.trackingNumber} - {parcel.senderName} →{" "}
                  {parcel.recipientName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {customTracking && (
            <p className="text-xs text-muted-foreground">
              Clear the tracking number below to select a parcel
            </p>
          )}
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t" />
          <span className="text-sm text-muted-foreground">OR</span>
          <div className="flex-1 border-t" />
        </div>

        {/* Custom Tracking Number */}
        <div className="space-y-2">
          <Label htmlFor="custom-tracking">Enter Tracking Number</Label>
          <Input
            id="custom-tracking"
            placeholder="Enter tracking number manually..."
            value={customTracking}
            onChange={(e) => handleCustomTrackingChange(e.target.value)}
            className={selectedParcel ? "opacity-50" : ""}
          />
          {selectedParcel && (
            <p className="text-xs text-muted-foreground">
              Clear the parcel selection above to enter a custom tracking number
            </p>
          )}
        </div>

        {/* Generate Button */}
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleGenerateQR} className="flex-1">
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>QR Code Generated</DialogTitle>
                <DialogDescription>
                  Scan this QR code to track the parcel
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center">
                <QRCodeDisplay trackingNumber={trackingNumber} size="lg" />
              </div>
            </DialogContent>
          </Dialog>

          {currentParcel?.senderEmail && (
            <Button
              variant="outline"
              onClick={handleEmailQR}
              disabled={isSendingEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isSendingEmail ? "Sending..." : "Email QR"}
            </Button>
          )}
        </div>

        {/* Info Text */}
        <p className="text-sm text-muted-foreground">
          QR codes can be scanned by customers to quickly access parcel tracking
          information.
        </p>
      </CardContent>
    </Card>
  );
}
