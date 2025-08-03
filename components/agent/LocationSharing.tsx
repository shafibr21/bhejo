"use client";

import { useState, useEffect, useRef } from "react";
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
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <h3 className="text-xl font-semibold bg-gradient-to-r from-red-300 to-red-400 bg-clip-text text-transparent">
            Location Not Supported
          </h3>
        </div>
        <p className="text-sm text-slate-400">
          Your browser does not support geolocation. Please use a modern
          browser to enable location sharing.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-pulse"></div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
          Location Sharing
        </h3>
        {isSharing && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-800/50">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
            Live
          </span>
        )}
        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
      </div>
      
      <div className="space-y-4">
        {/* Location Status */}
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-200">Current Status</span>
            {isSharing ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-400" />
            )}
          </div>

          {location ? (
            <div className="space-y-1">
              <p className="text-sm text-slate-300">
                <strong>Coordinates:</strong>{" "}
                {formatCoordinates(location.latitude, location.longitude)}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last updated: {location.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No location data available
            </p>
          )}

          {error && <p className="text-sm text-red-300 mt-2">Error: {error}</p>}
        </div>

        {/* Parcel Selection */}
        {assignedParcels.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Active Parcel (Optional)
            </label>
            <select
              className="w-full p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
              value={selectedParcel}
              onChange={(e) => setSelectedParcel(e.target.value)}
            >
              <option value="" className="bg-slate-800 text-slate-100">Select a parcel...</option>
              {assignedParcels.map((parcel) => (
                <option key={parcel._id} value={parcel._id} className="bg-slate-800 text-slate-100">
                  {parcel.trackingNumber} - {parcel.status}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400">
              Link your location to a specific parcel for better tracking
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-purple-900/20 border border-purple-800/50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-200">
              {isSharing ? "Stop sharing location" : "Start sharing location"}
            </p>
            <p className="text-xs text-slate-400">
              {isSharing
                ? "Updates every 15 seconds while active"
                : "Enable real-time location tracking"}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSharing}
              onChange={handleToggleSharing}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* One-time location button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={isSharing}
          className="w-full inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 px-4 py-2.5 bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Update Current Location
        </button>

        {/* Information */}
        <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-700/50">
          <p>
            • Location sharing helps customers track their parcels in real-time
          </p>
          <p>• Your location is only shared while you're on duty</p>
          <p>• You can stop sharing at any time</p>
        </div>
      </div>
    </div>
  );
}
