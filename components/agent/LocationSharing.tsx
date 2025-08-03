"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  MapPin,
  Navigation,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";

interface LocationSharingProps {
  assignedParcels?: Array<{
    _id: string;
    trackingNumber: string;
    senderAddress: string;
    recipientAddress: string;
    status: string;
  }>;
}

export function LocationSharing({
  assignedParcels = [],
}: LocationSharingProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    location,
    error,
    isSupported,
    startSharing,
    stopSharing,
    getOneTimeLocation,
  } = useGeolocation({
    updateInterval: 15000, // 15 seconds
    enableHighAccuracy: true,
  });

  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleToggleSharing = async () => {
    if (!isSupported) {
      toast({
        title: "Location Not Supported",
        description: "Your browser does not support location sharing.",
        variant: "destructive",
      });
      return;
    }

    if (isSharing) {
      // Stop sharing
      if (intervalRef.current) {
        stopSharing(intervalRef.current);
        intervalRef.current = null;
      }
      setIsSharing(false);
      toast({
        title: "Location Sharing Stopped",
        description: "You are no longer sharing your location.",
      });
    } else {
      // Start sharing
      try {
        const interval = startSharing(selectedParcel || undefined);
        if (interval) {
          intervalRef.current = interval;
        }
        setIsSharing(true);
        toast({
          title: "Location Sharing Started",
          description:
            "Your location is now being shared for real-time tracking.",
          className: "bg-green-50 border-green-200",
        });
      } catch (err) {
        toast({
          title: "Failed to Start Sharing",
          description: error || "Could not access your location.",
          variant: "destructive",
        });
      }
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      await getOneTimeLocation();
      toast({
        title: "Location Updated",
        description: "Your current location has been recorded.",
      });
    } catch (err) {
      toast({
        title: "Location Error",
        description: error || "Could not get your current location.",
        variant: "destructive",
      });
    }
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Location Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your browser does not support geolocation. Please use a modern
            browser to enable location sharing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Sharing
          {isSharing && (
            <Badge variant="default" className="bg-green-600">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
              Live
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Status */}
        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Status</span>
            {isSharing ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-600" />
            )}
          </div>

          {location ? (
            <div className="space-y-1">
              <p className="text-sm">
                <strong>Coordinates:</strong>{" "}
                {formatCoordinates(location.latitude, location.longitude)}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last updated: {location.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No location data available
            </p>
          )}

          {error && <p className="text-sm text-red-600 mt-2">Error: {error}</p>}
        </div>

        {/* Parcel Selection */}
        {assignedParcels.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Active Parcel (Optional)
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedParcel}
              onChange={(e) => setSelectedParcel(e.target.value)}
            >
              <option value="">Select a parcel...</option>
              {assignedParcels.map((parcel) => (
                <option key={parcel._id} value={parcel._id}>
                  {parcel.trackingNumber} - {parcel.status}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Link your location to a specific parcel for better tracking
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">
              {isSharing ? "Stop sharing location" : "Start sharing location"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isSharing
                ? "Updates every 15 seconds while active"
                : "Enable real-time location tracking"}
            </p>
          </div>
          <Switch
            checked={isSharing}
            onCheckedChange={handleToggleSharing}
            className="data-[state=checked]:bg-green-600"
          />
        </div>

        {/* One-time location button */}
        <Button
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={isSharing}
          className="w-full"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Update Current Location
        </Button>

        {/* Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            • Location sharing helps customers track their parcels in real-time
          </p>
          <p>• Your location is only shared while you're on duty</p>
          <p>• You can stop sharing at any time</p>
        </div>
      </CardContent>
    </Card>
  );
}
