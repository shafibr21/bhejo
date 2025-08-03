"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      <Alert variant="destructive" className={className}>
        <QrCode className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code
        </CardTitle>
        <CardDescription>
          Scan to track parcel: {trackingNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {isLoading ? (
            <div
              className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"
              style={{
                width: sizeConfig[size].width,
                height: sizeConfig[size].height,
              }}
            >
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Generating QR code...</p>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <img
                src={qrCodeUrl}
                alt={`QR Code for tracking ${trackingNumber}`}
                className="border rounded-lg shadow-sm"
                style={{
                  width: sizeConfig[size].width,
                  height: sizeConfig[size].height,
                }}
              />
              {parcelData?.status && (
                <Badge
                  className="absolute -top-2 -right-2"
                  variant={
                    parcelData.status === "delivered" ? "default" : "secondary"
                  }
                >
                  {parcelData.status}
                </Badge>
              )}
            </div>
          )}
        </div>

        {parcelData && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">From:</span>
              <span className="font-medium">
                {parcelData.senderName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To:</span>
              <span className="font-medium">
                {parcelData.recipientName || "N/A"}
              </span>
            </div>
          </div>
        )}

        {(showDownload || showShare) && !isLoading && qrCodeUrl && (
          <div className="flex gap-2">
            {showDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            {showShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex-1"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Share2 className="h-4 w-4 mr-2" />
                )}
                {copied ? "Copied!" : "Share"}
              </Button>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          Scan with your phone's camera to track this parcel
        </p>
      </CardContent>
    </Card>
  );
}
