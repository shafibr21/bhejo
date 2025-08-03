"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (assignedParcels.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-muted-foreground">
            <Route className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No assigned parcels for route planning</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Delivery Route ({optimizedRoute.length} stops)
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={optimizeRoute}
                disabled={isOptimizing}
                variant="outline"
                size="sm"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {isOptimizing ? "Optimizing..." : "Optimize Route"}
              </Button>
              {optimizedRoute.length > 0 && (
                <Button onClick={openInGoogleMaps} variant="default" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Open in Maps
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Route Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {optimizedRoute.filter((s) => s.type === "pickup").length}
              </div>
              <div className="text-xs text-muted-foreground">Pickups</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {optimizedRoute.filter((s) => s.type === "delivery").length}
              </div>
              <div className="text-xs text-muted-foreground">Deliveries</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {optimizedRoute.filter((s) => s.priority === "high").length}
              </div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
          </div>

          {/* Route Steps */}
          <div className="space-y-3">
            {optimizedRoute.map((stop, index) => (
              <div
                key={`${stop.parcelId}-${stop.type}`}
                className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                  selectedStop === `${stop.parcelId}-${stop.type}`
                    ? "border-blue-500 bg-blue-50"
                    : "border-border hover:border-blue-300"
                }`}
                onClick={() => setSelectedStop(`${stop.parcelId}-${stop.type}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getStopIcon(stop.type)}</span>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(stop.priority)}
                      >
                        {stop.priority.toUpperCase()}
                      </Badge>
                      <Badge
                        variant={
                          stop.type === "pickup" ? "default" : "secondary"
                        }
                      >
                        {stop.type.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="font-medium">
                        {stop.trackingNumber} - {stop.contactName}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {stop.address}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {stop.contactPhone}
                      </p>
                      {stop.estimatedTime && (
                        <p className="text-sm text-blue-600 flex items-center gap-1">
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
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No active stops in your route</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Integration */}
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
  );
}
