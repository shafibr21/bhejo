"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QrCode, Search, ArrowLeft } from "lucide-react";
import { QRCodeDisplay } from "@/components/parcels/QRCodeDisplay";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/customer/tracking">
                <button className="px-4 py-2 bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 text-white rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 font-medium flex items-center gap-2 text-sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Tracking
                </button>
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                QR Code Generator
              </h1>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            <p className="text-slate-400">
              Generate QR codes for easy parcel tracking
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/20 via-blue-500/20 to-green-600/20 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Search className="h-5 w-5 text-green-400" />
                <h2 className="text-xl font-semibold text-slate-200">
                  Find Your Parcel
                </h2>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Enter your tracking number to generate a QR code
              </p>

              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="tracking"
                    className="text-sm font-medium text-slate-300"
                  >
                    Tracking Number
                  </label>
                  <input
                    id="tracking"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number..."
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600/90 to-blue-600/90 hover:from-green-500 hover:to-blue-500 disabled:from-slate-700/50 disabled:to-slate-600/50 text-white rounded-lg border border-green-500/30 hover:border-green-400/50 disabled:border-slate-600/30 transition-all duration-200 font-medium disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  ) : (
                    "Generate QR Code"
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 via-red-500/20 to-red-600/20 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-red-950/30 backdrop-blur-sm border border-red-800/50 rounded-xl p-4">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {parcelData && (
                <div className="mt-6 relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/10 via-slate-500/10 to-blue-600/10 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      Parcel Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                        <span className="text-slate-400 text-sm">
                          Tracking:
                        </span>
                        <span className="text-slate-200 font-mono text-sm bg-slate-800/60 px-2 py-1 rounded border border-slate-700/50">
                          {parcelData.trackingNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                        <span className="text-slate-400 text-sm">Status:</span>
                        <span className="text-slate-200 font-medium text-sm capitalize">
                          {parcelData.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                        <span className="text-slate-400 text-sm">From:</span>
                        <span className="text-slate-200 font-medium text-sm">
                          {parcelData.senderName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                        <span className="text-slate-400 text-sm">To:</span>
                        <span className="text-slate-200 font-medium text-sm">
                          {parcelData.recipientName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-400 text-sm">Type:</span>
                        <span className="text-slate-200 font-medium text-sm">
                          {parcelData.parcelType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Display Section */}
          <div className="space-y-6">
            {trackingNumber ? (
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl overflow-hidden">
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
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600/20 via-slate-500/20 to-slate-600/20 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-12">
                  <div className="text-center text-slate-400">
                    <QrCode className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2 text-slate-300">
                      No Tracking Number
                    </h3>
                    <p className="text-sm">
                      Enter a tracking number to generate QR code
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/20 via-blue-500/20 to-indigo-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-indigo-100 to-blue-200 bg-clip-text text-transparent">
                How to Use QR Codes
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-sm border border-blue-500/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <span className="text-blue-200 font-bold">1</span>
                  </div>
                </div>
                <h4 className="font-semibold mb-2 text-slate-200">Generate</h4>
                <p className="text-sm text-slate-400">
                  Enter your tracking number and generate a QR code
                </p>
              </div>
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-green-500/30 to-emerald-500/30 backdrop-blur-sm border border-green-500/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <span className="text-green-200 font-bold">2</span>
                  </div>
                </div>
                <h4 className="font-semibold mb-2 text-slate-200">
                  Save or Share
                </h4>
                <p className="text-sm text-slate-400">
                  Download the QR code or share it with others
                </p>
              </div>
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-purple-500/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <span className="text-purple-200 font-bold">3</span>
                  </div>
                </div>
                <h4 className="font-semibold mb-2 text-slate-200">Track</h4>
                <p className="text-sm text-slate-400">
                  Scan with any phone camera to instantly track your parcel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
