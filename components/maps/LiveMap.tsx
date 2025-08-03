"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MapPin, Navigation, Clock } from "lucide-react";
import { useSocket } from "@/context/SocketContext";

// Define libraries array outside component to prevent reloading
const libraries: ("geometry" | "drawing")[] = ["geometry", "drawing"];

interface Location {
  lat: number;
  lng: number;
}

interface AgentLocation extends Location {
  agentId: string;
  agentName?: string;
  timestamp: Date;
  parcelId?: string;
}

interface LiveMapProps {
  center?: Location;
  showDirections?: boolean;
  showAllAgents?: boolean;
  parcels?: Array<{
    _id: string;
    trackingNumber: string;
    senderAddress: string;
    recipientAddress: string;
    currentLocation?: {
      latitude: number;
      longitude: number;
      updatedAt: Date;
    };
    assignedAgent?: string;
  }>;
  agents?: Array<{
    _id: string;
    name: string;
    currentLocation?: {
      latitude: number;
      longitude: number;
      updatedAt: Date;
    };
  }>;
  trackingNumber?: string;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 23.8103, // Dhaka, Bangladesh
  lng: 90.4125,
};

export function LiveMap({
  center = defaultCenter,
  parcels = [],
  agents = [],
  showDirections = false,
  trackingNumber,
}: LiveMapProps) {
  const { socket } = useSocket();
  const [agentLocations, setAgentLocations] = useState<AgentLocation[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentLocation | null>(
    null
  );
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use ref to store parcels to avoid recreating calculateRoute
  const parcelsRef = useRef(parcels);
  parcelsRef.current = parcels;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Check if API key is available
  const hasApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== "";

  // Convert agents data to locations - use JSON stringify for stable comparison
  const agentsString = JSON.stringify(agents);

  useEffect(() => {
    const locations: AgentLocation[] = agents
      .filter((agent) => agent.currentLocation)
      .map((agent) => ({
        lat: agent.currentLocation!.latitude,
        lng: agent.currentLocation!.longitude,
        agentId: agent._id,
        agentName: agent.name,
        timestamp: new Date(agent.currentLocation!.updatedAt),
      }));

    setAgentLocations(locations);
  }, [agentsString]); // Use JSON string for stable comparison

  // Listen for real-time location updates
  useEffect(() => {
    if (socket) {
      const handleLocationUpdate = (data: any) => {
        const newLocation: AgentLocation = {
          lat: data.latitude,
          lng: data.longitude,
          agentId: data.agentId,
          agentName: data.agentName,
          timestamp: new Date(data.timestamp),
          parcelId: data.parcelId,
        };

        setAgentLocations((prev) => {
          const existingIndex = prev.findIndex(
            (loc) => loc.agentId === data.agentId
          );
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = newLocation;
            return updated;
          }
          return [...prev, newLocation];
        });
      };

      socket.on("agent-location-update", handleLocationUpdate);
      return () => {
        socket.off("agent-location-update", handleLocationUpdate);
      };
    }
  }, [socket]);

  const calculateRoute = useCallback(async () => {
    if (!isLoaded || !showDirections || parcelsRef.current.length === 0) return;

    setIsLoading(true);
    try {
      const directionsService = new window.google.maps.DirectionsService();

      // Get parcels with locations
      const parcelLocations = parcelsRef.current
        .filter((p) => p.senderAddress || p.recipientAddress)
        .slice(0, 8); // Google Maps allows max 8 waypoints

      if (parcelLocations.length < 2) {
        setIsLoading(false);
        return;
      }

      const waypoints = parcelLocations.slice(1, -1).map((parcel) => ({
        location: parcel.senderAddress || parcel.recipientAddress,
        stopover: true,
      }));

      directionsService.route(
        {
          origin:
            parcelLocations[0].senderAddress ||
            parcelLocations[0].recipientAddress,
          destination:
            parcelLocations[parcelLocations.length - 1].recipientAddress ||
            parcelLocations[parcelLocations.length - 1].senderAddress,
          waypoints,
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Route calculation error:", error);
      setIsLoading(false);
    }
  }, [isLoaded, showDirections]); // Only depend on stable values

  // Separate effect to trigger route calculation when parcels or showDirections change
  useEffect(() => {
    if (showDirections && parcels.length > 0) {
      calculateRoute();
    }
  }, [showDirections, parcels.length]); // Remove calculateRoute from dependencies to prevent infinite loop

  // If no API key is provided, show a demo placeholder
  if (!hasApiKey) {
    return (
      <div className="h-96 bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <MapPin className="h-16 w-16 mx-auto text-slate-400" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                Live Map Demo
              </h3>
              <p className="text-sm text-slate-400 max-w-md">
                This would show real-time tracking of parcels and delivery
                agents with Google Maps integration. API key required for live
                functionality.
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <div className="flex items-center gap-1 text-xs text-blue-300 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {agentLocations.length} Active Agents
                </div>
                <div className="flex items-center gap-1 text-xs text-green-300 bg-green-900/30 px-2 py-1 rounded border border-green-800/50">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {parcels.length} Parcels Tracked
                </div>
                {showDirections && (
                  <div className="flex items-center gap-1 text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded border border-purple-800/50">
                    <Navigation className="w-3 h-3" />
                    Route Optimization
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-slate-400 animate-pulse" />
          <p className="text-slate-300">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {/* Agent location markers */}
        {agentLocations.map((location) => (
          <Marker
            key={location.agentId}
            position={{ lat: location.lat, lng: location.lng }}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
                  <circle cx="16" cy="16" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
            }}
            onClick={() => setSelectedAgent(location)}
          />
        ))}

        {/* Parcel markers */}
        {parcels.map((parcel) =>
          parcel.currentLocation ? (
            <Marker
              key={parcel._id}
              position={{
                lat: parcel.currentLocation.latitude,
                lng: parcel.currentLocation.longitude,
              }}
              icon={{
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="8" width="20" height="16" rx="2" fill="#10b981" stroke="#059669" stroke-width="2"/>
                    <rect x="10" y="12" width="12" height="2" fill="white"/>
                    <rect x="10" y="16" width="8" height="2" fill="white"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(32, 32),
              }}
              title={parcel.trackingNumber}
            />
          ) : null
        )}

        {/* Directions renderer */}
        {directions && showDirections && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#3b82f6",
                strokeWeight: 4,
              },
            }}
          />
        )}

        {/* Info window for selected agent */}
        {selectedAgent && (
          <InfoWindow
            position={{ lat: selectedAgent.lat, lng: selectedAgent.lng }}
            onCloseClick={() => setSelectedAgent(null)}
          >
            <div className="p-2 bg-slate-800 text-white rounded-lg border border-slate-700">
              <h3 className="font-semibold text-slate-100">
                {selectedAgent.agentName || "Agent"}
              </h3>
              <p className="text-sm text-slate-300 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated: {selectedAgent.timestamp.toLocaleTimeString()}
              </p>
              {selectedAgent.parcelId && (
                <p className="text-sm text-blue-300">
                  Handling parcel: {selectedAgent.parcelId}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
