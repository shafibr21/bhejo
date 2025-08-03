import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/hooks/useAuth";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  updateInterval?: number; // milliseconds
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
    updateInterval = 15000, // 15 seconds
  } = options;

  const { socket } = useSocket();
  const { user } = useAuth();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if geolocation is supported
  useEffect(() => {
    setIsSupported("geolocation" in navigator);
  }, []);

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy,
        timeout,
        maximumAge,
      });
    });
  }, [enableHighAccuracy, timeout, maximumAge]);

  const updateLocation = useCallback(
    async (parcelId?: string) => {
      if (!user || user.role !== "agent") return;

      try {
        const position = await getCurrentPosition();
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(),
        };

        setLocation(locationData);
        setError(null);

        // Send to backend API
        const response = await fetch("/api/agents/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            parcelId,
          }),
        });

        if (response.ok) {
          // Emit via socket for real-time updates
          socket?.emit("agent-location-update", {
            agentId: user._id,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            timestamp: locationData.timestamp,
            parcelId,
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get location";
        setError(errorMessage);
        console.error("Location update error:", err);
      }
    },
    [getCurrentPosition, socket, user]
  );

  const startSharing = useCallback(
    (parcelId?: string) => {
      if (!isSupported || !user || user.role !== "agent") {
        setError("Location sharing not available");
        return;
      }

      setIsSharing(true);

      // Initial location update
      updateLocation(parcelId);

      // Set up interval for continuous updates
      const intervalId = setInterval(() => {
        updateLocation(parcelId);
      }, updateInterval);

      // Store interval ID for cleanup
      return intervalId;
    },
    [isSupported, user, updateLocation, updateInterval]
  );

  const stopSharing = useCallback((intervalId?: NodeJS.Timeout) => {
    setIsSharing(false);
    if (intervalId) {
      clearInterval(intervalId);
    }
  }, []);

  const getOneTimeLocation = useCallback(async () => {
    try {
      const position = await getCurrentPosition();
      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(),
      };

      setLocation(locationData);
      setError(null);
      return locationData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get location";
      setError(errorMessage);
      throw err;
    }
  }, [getCurrentPosition]);

  return {
    location,
    error,
    isSharing,
    isSupported,
    startSharing,
    stopSharing,
    updateLocation,
    getOneTimeLocation,
  };
}
