"use client";

import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Camera,
  CameraOff,
  Package,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  onScanSuccess: (
    trackingNumber: string,
    action: "pickup" | "delivery"
  ) => void;
  isScanning?: boolean;
  expectedAction?: "pickup" | "delivery";
}

interface ScanResult {
  trackingNumber: string;
  action: "pickup" | "delivery";
  timestamp: Date;
}

export function BarcodeScanner({
  onScanSuccess,
  isScanning = false,
  expectedAction,
}: BarcodeScannerProps) {
  const [scannerActive, setScannerActive] = useState(false);
  const [manualEntry, setManualEntry] = useState("");
  const [lastScanned, setLastScanned] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { toast } = useToast();

  const config = {
    fps: 10,
    qrbox: {
      width: 250,
      height: 250,
    },
    aspectRatio: 1.0,
    disableFlip: false,
  };

  const startScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    const scanner = new Html5QrcodeScanner("qr-reader", config, false);
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        handleScanSuccess(decodedText);
        scanner.clear();
        setScannerActive(false);
      },
      (error) => {
        // Handle scan failure silently
        console.warn("QR scan error:", error);
      }
    );

    setScannerActive(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScannerActive(false);
  };

  const handleScanSuccess = async (scannedText: string) => {
    setIsProcessing(true);

    try {
      // Extract tracking number from scanned text
      // Assume format is either just the tracking number or a JSON object
      let trackingNumber = scannedText;

      try {
        const parsed = JSON.parse(scannedText);
        if (parsed.trackingNumber) {
          trackingNumber = parsed.trackingNumber;
        }
      } catch {
        // Not JSON, use as-is
      }

      // Validate tracking number format
      if (!isValidTrackingNumber(trackingNumber)) {
        toast({
          title: "Invalid Tracking Number",
          description:
            "The scanned code doesn't contain a valid tracking number.",
          variant: "destructive",
        });
        return;
      }

      const action = expectedAction || "pickup";
      const result: ScanResult = {
        trackingNumber,
        action,
        timestamp: new Date(),
      };

      setLastScanned(result);
      onScanSuccess(trackingNumber, action);

      toast({
        title: "Scan Successful",
        description: `${
          action === "pickup" ? "Pickup" : "Delivery"
        } confirmed for ${trackingNumber}`,
      });
    } catch (error) {
      toast({
        title: "Scan Error",
        description: "Failed to process the scanned code.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEntry = () => {
    if (!manualEntry.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a tracking number.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidTrackingNumber(manualEntry)) {
      toast({
        title: "Invalid Tracking Number",
        description: "Please enter a valid tracking number format.",
        variant: "destructive",
      });
      return;
    }

    handleScanSuccess(manualEntry);
    setManualEntry("");
  };

  const isValidTrackingNumber = (trackingNumber: string): boolean => {
    // Simple validation - adjust based on your tracking number format
    return /^[A-Z0-9]{8,20}$/.test(trackingNumber.toUpperCase());
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Barcode Scanner
          {expectedAction && (
            <Badge
              variant={expectedAction === "pickup" ? "default" : "secondary"}
            >
              {expectedAction.toUpperCase()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Last Scanned Result */}
        {lastScanned && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">Last Confirmed</span>
            </div>
            <div className="mt-1 text-sm text-green-700">
              <p>
                {lastScanned.trackingNumber} -{" "}
                {lastScanned.action.toUpperCase()}
              </p>
              <p>{lastScanned.timestamp.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Scanner Controls */}
        <div className="flex gap-2">
          <Button
            onClick={scannerActive ? stopScanner : startScanner}
            disabled={isProcessing}
            className="flex-1"
          >
            {scannerActive ? (
              <>
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Scanner
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Start Scanner
              </>
            )}
          </Button>
        </div>

        {/* Scanner Area */}
        {scannerActive && (
          <div className="space-y-2">
            <div
              id="qr-reader"
              className="w-full border rounded-lg overflow-hidden"
            />
            <p className="text-sm text-muted-foreground text-center">
              Point your camera at the QR code or barcode
            </p>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm">Processing scan...</span>
          </div>
        )}

        {/* Manual Entry */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Manual Entry</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter tracking number"
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleManualEntry()}
            />
            <Button onClick={handleManualEntry} disabled={isProcessing}>
              Confirm
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Instructions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Scan the QR code on the parcel label</li>
                <li>Or enter the tracking number manually</li>
                <li>
                  Confirm {expectedAction || "pickup/delivery"} before
                  proceeding
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
