"use client";

import { useState, useEffect } from "react";
import {
  Navigation,
  MapPin,
  Clock,
  Route,
  AlertCircle,
  Phone,
} from "lucide-react";
import { LiveMap } from "@/components/maps/LiveMap";

interface DeliveryRouteProps {
  assignedParcels: Array<{
    _id: string;
    trackingNumber: string;
    senderName: string;
    senderAddress: string;
    senderPhone: string;
    recipientName: string;
    recipientAddress: string;
    recipientPhone: string;
    status: string;
    priority?: "high" | "medium" | "low";
  }>;
  agentLocation?: {
    latitude: number;
    longitude: number;
    updatedAt: Date;
  };
}

interface OptimizedStop {
  parcelId: string;
  type: "pickup" | "delivery";
  address: string;
  contactName: string;
  contactPhone: string;
  trackingNumber: string;
  estimatedTime?: string;
  priority: "high" | "medium" | "low";
}

export function DeliveryRoute({
  assignedParcels,
  agentLocation,
}: DeliveryRouteProps) {
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedStop[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedStop, setSelectedStop] = useState<string>("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-900/30 text-red-300 border border-red-800/50";
      case "medium":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-800/50";
      case "low":
        return "bg-green-900/30 text-green-300 border border-green-800/50";
      default:
        return "bg-slate-800/60 text-slate-200 border border-slate-700/50";
    }
  };

  // Generate route stops from parcels
  useEffect(() => {
    const generateStops = () => {
      const stops: OptimizedStop[] = [];

      assignedParcels.forEach((parcel) => {
        // Add pickup stop if parcel is pending
        if (parcel.status === "pending") {
          stops.push({
            parcelId: parcel._id,
            type: "pickup",
            address: parcel.senderAddress,
            contactName: parcel.senderName,
            contactPhone: parcel.senderPhone,
            trackingNumber: parcel.trackingNumber,
            priority: parcel.priority || "medium",
          });
        }

        // Add delivery stop if parcel is picked up or in transit
        if (parcel.status === "picked-up" || parcel.status === "in-transit") {
          stops.push({
            parcelId: parcel._id,
            type: "delivery",
            address: parcel.recipientAddress,
            contactName: parcel.recipientName,
            contactPhone: parcel.recipientPhone,
            trackingNumber: parcel.trackingNumber,
            priority: parcel.priority || "medium",
          });
        }
      });

      // Sort by priority (high -> medium -> low) and type (pickup first)
      stops.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const typeOrder = { pickup: 2, delivery: 1 };

        if (a.priority !== b.priority) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        return typeOrder[b.type] - typeOrder[a.type];
      });

      setOptimizedRoute(stops);
    };

    generateStops();
  }, [assignedParcels]);

  const optimizeRoute = async () => {
    setIsOptimizing(true);
    try {
      // In a real implementation, this would call Google Maps Directions API
      // For now, we'll simulate optimization by reordering based on priority and distance

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      // Simple optimization: group by area (could be enhanced with actual routing)
      const optimized = [...optimizedRoute].sort((a, b) => {
        // In reality, this would use actual distances and traffic data
        return a.address.localeCompare(b.address);
      });

      setOptimizedRoute(optimized);
    } catch (error) {
      console.error("Route optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const openInGoogleMaps = () => {
    if (optimizedRoute.length === 0 || !agentLocation) return;

    const origin = `${agentLocation.latitude},${agentLocation.longitude}`;
    const waypoints = optimizedRoute
      .slice(0, -1)
      .map((stop) => encodeURIComponent(stop.address))
      .join("|");
    const destination = encodeURIComponent(
      optimizedRoute[optimizedRoute.length - 1].address
    );

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;

    window.open(url, "_blank");
  };

  const getStopIcon = (type: "pickup" | "delivery") => {
    return type === "pickup" ? "📦" : "🏠";
  };

  if (assignedParcels.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-48">
          <div className="text-center text-slate-400">
            <Route className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No assigned parcels for route planning</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-cyan-500 rounded-full animate-pulse"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-orange-100 to-cyan-200 bg-clip-text text-transparent">
            Delivery Route
          </h2>
          <span className="px-1 py-1 md:px-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-slate-300">
            {optimizedRoute.length} stops
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent"></div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={optimizeRoute}
            disabled={isOptimizing}
            className="px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-orange-600/80 to-cyan-600/80 hover:from-orange-500/90 hover:to-cyan-500/90 disabled:from-slate-700/50 disabled:to-slate-600/50 text-white rounded-lg border border-orange-500/30 hover:border-orange-400/50 disabled:border-slate-600/30 transition-all duration-200 flex items-center gap-2 text-sm font-medium disabled:cursor-not-allowed"
          >
            <Navigation className="h-4 w-4" />
            {isOptimizing ? "Optimizing..." : "Optimize Route"}
          </button>
          {optimizedRoute.length > 0 && (
            <button
              onClick={openInGoogleMaps}
              className="px-4 py-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500/90 hover:to-purple-500/90 text-white rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <MapPin className="h-4 w-4" />
              Open in Maps
            </button>
          )}
        </div>
      </div>

      {/* Route Summary */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {optimizedRoute.filter((s) => s.type === "pickup").length}
          </div>
          <div className="text-sm text-slate-400">Pickups</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {optimizedRoute.filter((s) => s.type === "delivery").length}
          </div>
          <div className="text-sm text-slate-400">Deliveries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            {optimizedRoute.filter((s) => s.priority === "high").length}
          </div>
          <div className="text-sm text-slate-400">High Priority</div>
        </div>
      </div>

      {/* Route Steps */}
      <div className="space-y-3">
        {optimizedRoute.map((stop, index) => (
          <div
            key={`${stop.parcelId}-${stop.type}`}
            className={`p-4 bg-slate-800/40 backdrop-blur-sm border rounded-xl transition-all duration-200 cursor-pointer hover:bg-slate-700/50 ${
              selectedStop === `${stop.parcelId}-${stop.type}`
                ? "border-blue-500/50 bg-blue-950/20 shadow-lg shadow-blue-500/10"
                : "border-slate-700/50 hover:border-slate-600/50"
            }`}
            onClick={() => setSelectedStop(`${stop.parcelId}-${stop.type}`)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getStopIcon(stop.type)}</span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(
                      stop.priority
                    )}`}
                  >
                    {stop.priority.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      stop.type === "pickup"
                        ? "bg-blue-900/40 text-blue-300 border border-blue-800/50"
                        : "bg-purple-900/40 text-purple-300 border border-purple-800/50"
                    }`}
                  >
                    {stop.type.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-slate-200">
                    {stop.trackingNumber} - {stop.contactName}
                  </p>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {stop.address}
                  </p>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {stop.contactPhone}
                  </p>
                  {stop.estimatedTime && (
                    <p className="text-sm text-cyan-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ETA: {stop.estimatedTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {optimizedRoute.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600/20 via-slate-500/20 to-slate-600/20 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-500" />
              <p className="text-slate-400">No active stops in your route</p>
            </div>
          </div>
        </div>
      )}

      {/* Map Integration */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600/20 via-blue-500/20 to-cyan-600/20 rounded-2xl blur opacity-30"></div>
        <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl overflow-hidden">
          <LiveMap
            parcels={assignedParcels.map((p) => ({
              _id: p._id,
              trackingNumber: p.trackingNumber,
              senderAddress: p.senderAddress,
              recipientAddress: p.recipientAddress,
              currentLocation: agentLocation
                ? {
                    latitude: agentLocation.latitude,
                    longitude: agentLocation.longitude,
                    updatedAt: agentLocation.updatedAt,
                  }
                : undefined,
            }))}
            showDirections={true}
            center={
              agentLocation
                ? {
                    lat: agentLocation.latitude,
                    lng: agentLocation.longitude,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
