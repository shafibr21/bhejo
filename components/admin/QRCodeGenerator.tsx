"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="relative">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur-sm opacity-25 animate-pulse"></div>

      <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-2xl">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 mb-4 shadow-lg shadow-blue-500/25">
              <QrCode className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent mb-2">
              QR Code Generator
            </h2>
            <p className="text-slate-400">
              Generate QR codes for seamless parcel tracking
            </p>
          </div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-2xl">
            <div className="p-6 sm:p-8">
              {/* Parcel Selection */}
              <div className="space-y-3 mb-2">
                <label className="block text-sm font-semibold text-blue-300 mb-3 ">
                  Select Parcel
                </label>
                <div className="relative ">
                  <Select
                    value={selectedParcel}
                    onValueChange={handleParcelSelect}
                  >
                    <SelectTrigger
                      className={`bg-slate-800/50 border-slate-700/50 text-white hover:border-slate-600/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 ${
                        customTracking ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <SelectValue
                        placeholder="Choose a parcel..."
                        className="text-slate-400 "
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {parcels.map((parcel) => (
                        <SelectItem
                          key={parcel._id}
                          value={parcel._id}
                          className="hover:bg-slate-700 focus:bg-slate-700"
                        >
                          {parcel.trackingNumber} - {parcel.senderName} →{" "}
                          {parcel.recipientName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                {customTracking && (
                  <p className="text-xs text-slate-500 italic">
                    Clear the tracking number below to select a parcel
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            <span className="text-sm font-medium text-slate-400 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">
              OR
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          {/* Custom Tracking Number */}
          <div className="space-y-3 mb-4">
            <label className="block text-sm font-semibold text-blue-300 mb-3">
              Enter Tracking Number
            </label>
            <div className="relative">
              <Input
                id="custom-tracking"
                placeholder="Enter tracking number manually..."
                value={customTracking}
                onChange={(e) => handleCustomTrackingChange(e.target.value)}
                className={`bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 ${
                  selectedParcel
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-slate-600/50"
                }`}
                disabled={!!selectedParcel}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {selectedParcel && (
              <p className="text-xs text-slate-500 italic">
                Clear the parcel selection above to enter a custom tracking
                number
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={handleGenerateQR}
                  disabled={!selectedParcel && !customTracking.trim()}
                  className="flex-1 relative group overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <div className="relative flex items-center justify-center gap-2">
                    <QrCode className="h-5 w-5" />
                    <span>Generate QR Code</span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-slate-900/95 backdrop-blur-sm border-slate-800/50 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    QR Code Generated
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Scan this QR code to track the parcel
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center">
                  <QRCodeDisplay trackingNumber={trackingNumber} size="lg" />
                </div>
              </DialogContent>
            </Dialog>

            {currentParcel?.senderEmail && (
              <button
                onClick={handleEmailQR}
                disabled={isSendingEmail}
                className="sm:flex-none relative group overflow-hidden bg-slate-800/50 hover:bg-slate-700/50 disabled:bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 disabled:border-slate-700/30 text-slate-300 hover:text-white disabled:text-slate-500 font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
              >
                <div className="relative flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" />
                  <span>{isSendingEmail ? "Sending..." : "Email QR"}</span>
                  {isSendingEmail && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"></div>
                  )}
                </div>
              </button>
            )}
          </div>

          {/* Info Text */}
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-950/30 to-cyan-950/30 border border-blue-800/30 rounded-xl">
            <QrCode className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-300 leading-relaxed">
              QR codes can be scanned by customers to quickly access parcel
              tracking information and stay updated on their delivery status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
