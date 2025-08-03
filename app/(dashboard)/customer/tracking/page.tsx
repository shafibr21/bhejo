"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Search,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/parcelStatus";
import { useRealtimeParcelTracking } from "@/hooks/useRealtimeParcels";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import { LiveMap } from "@/components/maps/LiveMap";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/hooks/useAuth";

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [parcel, setParcel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trackedParcelId, setTrackedParcelId] = useState<string | null>(null);

  const { socket } = useSocket();
  const { user } = useAuth();

  // Use real-time tracking hook
  const {
    parcel: realtimeParcel,
    statusHistory: realtimeStatusHistory,
    isConnected,
    isTracking,
  } = useRealtimeParcelTracking(trackedParcelId || "");

  // Join user room for real-time updates
  useEffect(() => {
    if (socket && user) {
      socket.emit("join-user", user._id);
      console.log(`Customer ${user._id} joined real-time room`);
    }
  }, [socket, user]);

  // Update parcel data when real-time data changes
  useEffect(() => {
    if (realtimeParcel) {
      setParcel(realtimeParcel);
    }
  }, [realtimeParcel]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError("");
    setParcel(null);
    setTrackedParcelId(null);

    try {
      const response = await fetch(`/api/parcels/track/${trackingNumber}`);

      if (response.ok) {
        const data = await response.json();
        setParcel(data);
        setTrackedParcelId(data._id); // Enable real-time tracking
      } else {
        setError("Parcel not found. Please check your tracking number.");
      }
    } catch (error) {
      setError("An error occurred while tracking your parcel.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "assigned":
      case "picked_up":
        return <Package className="h-4 w-4" />;
      case "in_transit":
      case "out_for_delivery":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
      case "returned":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-800/50";
      case "assigned":
        return "bg-blue-900/30 text-blue-300 border border-blue-800/50";
      case "picked-up":
      case "picked_up":
        return "bg-purple-900/30 text-purple-300 border border-purple-800/50";
      case "in-transit":
      case "in_transit":
        return "bg-cyan-900/30 text-cyan-300 border border-cyan-800/50";
      case "out-for-delivery":
      case "out_for_delivery":
        return "bg-orange-900/30 text-orange-300 border border-orange-800/50";
      case "delivered":
        return "bg-green-900/30 text-green-300 border border-green-800/50";
      case "failed":
      case "returned":
        return "bg-red-900/30 text-red-300 border border-red-800/50";
      default:
        return "bg-slate-800/60 text-slate-200 border border-slate-700/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Track Your Parcel
              </h1>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            <p className="text-slate-400">
              Enter your tracking number to get real-time updates
            </p>
          </div>
        </div>

        {/* Tracking Form */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/20 via-blue-500/20 to-green-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-green-400" />
                <h2 className="text-xl font-semibold text-slate-200">
                  Track Parcel
                </h2>
              </div>
              <ConnectionStatus />
            </div>

            <div className="mb-4">
              <p className="text-slate-400 text-sm">
                Enter your tracking number to get real-time updates
                {isTracking && (
                  <span className="text-green-400 font-medium ml-2">
                    • Live tracking active
                  </span>
                )}
              </p>
            </div>

            <form onSubmit={handleTrack} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="trackingNumber"
                  className="text-sm font-medium text-slate-300"
                >
                  Tracking Number
                </label>
                <input
                  id="trackingNumber"
                  type="text"
                  placeholder="Enter tracking number (e.g., CP1234567890ABCD)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
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
                    Tracking...
                  </div>
                ) : (
                  "Track Parcel"
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
          </div>
        </div>

        {/* Tracking Results */}
        {parcel && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Parcel Info */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-purple-400" />
                    <h2 className="text-xl font-semibold text-slate-200">
                      {(parcel as any).trackingNumber}
                    </h2>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusBadgeColor(
                      (parcel as any).status
                    )}`}
                  >
                    {
                      STATUS_LABELS[
                        (parcel as any).status as keyof typeof STATUS_LABELS
                      ]
                    }
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      Sender
                    </h3>
                    <div className="pl-4 space-y-1">
                      <p className="text-slate-200">
                        {(parcel as any).senderName}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {(parcel as any).senderPhone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      Recipient
                    </h3>
                    <div className="pl-4 space-y-1">
                      <p className="text-slate-200">
                        {(parcel as any).recipientName}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {(parcel as any).recipientPhone}
                      </p>
                      {(parcel as any).recipientEmail && (
                        <p className="text-slate-400 text-sm">
                          {(parcel as any).recipientEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600/20 via-yellow-500/20 to-orange-600/20 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-semibold text-slate-200">
                    Tracking History
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent"></div>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Follow your parcel's journey
                </p>

                <div className="space-y-4">
                  {(parcel as any).statusHistory?.map(
                    (status: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm border border-orange-600/30 rounded-full">
                            <div className="text-orange-300">
                              {getStatusIcon(status.status)}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-200">
                              {
                                STATUS_LABELS[
                                  status.status as keyof typeof STATUS_LABELS
                                ]
                              }
                            </h4>
                            <span className="text-sm text-slate-400">
                              {new Date(status.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {status.notes && (
                            <p className="text-sm text-slate-300 mb-2 bg-slate-800/30 rounded-md p-2 border border-slate-700/30">
                              {status.notes}
                            </p>
                          )}
                          {status.location && (
                            <p className="text-sm text-slate-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {status.location.address}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Current Location & Live Map */}
            {(parcel as any).currentLocation && (
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600/20 via-blue-500/20 to-cyan-600/20 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-5 w-5 text-cyan-400" />
                      <h2 className="text-xl font-semibold text-slate-200">
                        Live Tracking
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Real-time location of your parcel
                    </p>
                  </div>
                  <div className="p-0">
                    <LiveMap
                      parcels={[
                        {
                          _id: (parcel as any)._id,
                          trackingNumber: (parcel as any).trackingNumber,
                          senderAddress: (parcel as any).senderAddress,
                          recipientAddress: (parcel as any).recipientAddress,
                          currentLocation: (parcel as any).currentLocation,
                        },
                      ]}
                      showDirections={true}
                      center={
                        (parcel as any).currentLocation
                          ? {
                              lat: (parcel as any).currentLocation.latitude,
                              lng: (parcel as any).currentLocation.longitude,
                            }
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
