"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Search, ArrowLeft } from "lucide-react";
import { QRCodeDisplay } from "@/components/parcels/QRCodeDisplay";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";

export default function QRCodePage() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [parcelData, setParcelData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-populate from URL params
  useEffect(() => {
    const tracking = searchParams.get("trackingNumber");
    if (tracking) {
      setTrackingNumber(tracking);
      fetchParcelData(tracking);
    }
  }, [searchParams]);

  const fetchParcelData = async (tracking: string) => {
    if (!tracking.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/parcels/track/${tracking}`);

      if (response.ok) {
        const data = await response.json();
        setParcelData(data);
      } else {
        setError("Parcel not found. Please check your tracking number.");
        setParcelData(null);
      }
    } catch (err) {
      setError("Error fetching parcel information.");
      setParcelData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchParcelData(trackingNumber);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customer/tracking">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracking
          </Button>
        </Link>
        <PageHeader
          title="QR Code Generator"
          description="Generate QR codes for easy parcel tracking"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Parcel
            </CardTitle>
            <CardDescription>
              Enter your tracking number to generate a QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number..."
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Searching..." : "Generate QR Code"}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {parcelData && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold">Parcel Information</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking:</span>
                    <span className="font-medium">
                      {parcelData.trackingNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">
                      {parcelData.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{parcelData.senderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">
                      {parcelData.recipientName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{parcelData.parcelType}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code Display Section */}
        <div className="space-y-6">
          {trackingNumber && (
            <QRCodeDisplay
              trackingNumber={trackingNumber}
              parcelData={
                parcelData
                  ? {
                      _id: parcelData._id,
                      senderName: parcelData.senderName,
                      recipientName: parcelData.recipientName,
                      status: parcelData.status,
                    }
                  : undefined
              }
              size="lg"
              showDownload={true}
              showShare={true}
            />
          )}

          {!trackingNumber && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-gray-500">
                  <QrCode className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">
                    No Tracking Number
                  </h3>
                  <p>Enter a tracking number to generate QR code</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use QR Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Generate</h4>
              <p className="text-sm text-gray-600">
                Enter your tracking number and generate a QR code
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Save or Share</h4>
              <p className="text-sm text-gray-600">
                Download the QR code or share it with others
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Track</h4>
              <p className="text-sm text-gray-600">
                Scan with any phone camera to instantly track your parcel
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
