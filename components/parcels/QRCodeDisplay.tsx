"use client";

import { useState, useEffect } from "react";
import {
  QrCode,
  Download,
  Share2,
  Copy,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { generateTrackingQRCode, downloadQRCode } from "@/utils/generateQRCode";
import { useToast } from "@/hooks/use-toast";

interface QRCodeDisplayProps {
  trackingNumber: string;
  parcelData?: {
    _id: string;
    senderName?: string;
    recipientName?: string;
    status?: string;
  };
  size?: "sm" | "md" | "lg";
  showDownload?: boolean;
  showShare?: boolean;
  className?: string;
}

export function QRCodeDisplay({
  trackingNumber,
  parcelData,
  size = "md",
  showDownload = true,
  showShare = true,
  className = "",
}: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const sizeConfig = {
    sm: { width: 150, height: 150 },
    md: { width: 200, height: 200 },
    lg: { width: 300, height: 300 },
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    generateQRCode();
  }, [trackingNumber]);

  const generateQRCode = async () => {
    if (!trackingNumber) return;

    setIsLoading(true);
    setError("");

    try {
      const qrCode = await generateTrackingQRCode(trackingNumber, baseUrl, {
        width: sizeConfig[size].width,
        height: sizeConfig[size].height,
        color: {
          dark: "#1f2937",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });
      setQrCodeUrl(qrCode);
    } catch (err) {
      setError("Failed to generate QR code");
      console.error("QR Code generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const filename = `qr-code-${trackingNumber}.png`;
      downloadQRCode(qrCodeUrl, filename);
      toast({
        title: "QR Code Downloaded",
        description: `Saved as ${filename}`,
      });
    }
  };

  const handleCopyLink = async () => {
    const trackingUrl = `${baseUrl}/customer/tracking?trackingNumber=${trackingNumber}`;
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Tracking link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const trackingUrl = `${baseUrl}/customer/tracking?trackingNumber=${trackingNumber}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Track Your Parcel",
          text: `Track parcel: ${trackingNumber}`,
          url: trackingUrl,
        });
      } catch (err) {
        // User cancelled sharing or sharing failed
        handleCopyLink();
      }
    } else {
      // Fallback to copying link
      handleCopyLink();
    }
  };

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg border border-red-500/30 bg-red-950/50 backdrop-blur-sm ${className}`}
      >
        <div className="flex items-start gap-3">
          <QrCode className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`backdrop-blur-sm bg-slate-800/30 border border-slate-700/50 rounded-xl shadow-xl ${className}`}
    >
      {/* Header */}
      <div className="text-center p-6 border-b border-slate-700/30">
        <div className="flex items-center justify-center gap-2 text-slate-200 mb-2">
          <QrCode className="h-5 w-5" />
          <h3 className="text-lg font-semibold">QR Code</h3>
        </div>
        <p className="text-slate-400 text-sm">
          Scan to track parcel: {trackingNumber}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex justify-center">
          {isLoading ? (
            <div
              className="flex items-center justify-center border-2 border-dashed border-slate-600/50 rounded-lg bg-slate-800/30"
              style={{
                width: sizeConfig[size].width,
                height: sizeConfig[size].height,
              }}
            >
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-500">Generating QR code...</p>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <img
                src={qrCodeUrl}
                alt={`QR Code for tracking ${trackingNumber}`}
                className="border border-slate-600/50 rounded-lg shadow-sm bg-white p-2"
                style={{
                  width: sizeConfig[size].width,
                  height: sizeConfig[size].height,
                }}
              />
              {parcelData?.status && (
                <div
                  className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    parcelData.status === "delivered"
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  {parcelData.status}
                </div>
              )}
            </div>
          )}
        </div>

        {parcelData && (
          <div className="space-y-2 text-sm bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
            <div className="flex justify-between">
              <span className="text-slate-400">From:</span>
              <span className="font-medium text-slate-200">
                {parcelData.senderName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">To:</span>
              <span className="font-medium text-slate-200">
                {parcelData.recipientName || "N/A"}
              </span>
            </div>
          </div>
        )}

        {(showDownload || showShare) && !isLoading && qrCodeUrl && (
          <div className="flex gap-2">
            {showDownload && (
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 rounded-lg text-purple-200 hover:text-purple-100 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium backdrop-blur-sm"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
            {showShare && (
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-teal-600/20 hover:from-cyan-600/30 hover:to-teal-600/30 border border-cyan-500/30 rounded-lg text-cyan-200 hover:text-cyan-100 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium backdrop-blur-sm"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Share"}
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-slate-500 text-center">
          Scan with your phone's camera to track this parcel
        </p>
      </div>
    </div>
  );
}
