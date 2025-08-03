"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ParcelCard } from "@/components/parcels/ParcelCard";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface RecentParcelsProps {
  recentParcels: any[];
}

export function RecentParcels({
  recentParcels: initialParcels,
}: RecentParcelsProps) {
  const { socket, isConnected } = useSocket();
  const [parcels, setParcels] = useState(initialParcels);
  const [newlyAdded, setNewlyAdded] = useState<string[]>([]);

  // Update parcels when initial data changes
  useEffect(() => {
    setParcels(initialParcels);
  }, [initialParcels]);

  // Listen for real-time parcel updates
  useEffect(() => {
    if (socket) {
      const handleParcelUpdate = (data: any) => {
        const newParcel = data.parcel;

        setParcels((prev) => {
          // Check if parcel already exists
          const existingIndex = prev.findIndex((p) => p._id === newParcel._id);

          if (existingIndex !== -1) {
            // Update existing parcel
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...newParcel,
            };
            return updated;
          } else {
            // Add new parcel to the beginning
            setNewlyAdded((prevNew) => [...prevNew, newParcel._id]);

            // Remove the highlight after 5 seconds
            setTimeout(() => {
              setNewlyAdded((prevNew) =>
                prevNew.filter((id) => id !== newParcel._id)
              );
            }, 5000);

            return [newParcel, ...prev.slice(0, 9)]; // Keep only 10 recent parcels
          }
        });
      };

      socket.on("parcel-update", handleParcelUpdate);
      socket.on("parcel-status-updated", handleParcelUpdate);
      socket.on("admin-parcel-update", handleParcelUpdate); // Admin-specific updates

      return () => {
        socket.off("parcel-update", handleParcelUpdate);
        socket.off("parcel-status-updated", handleParcelUpdate);
        socket.off("admin-parcel-update", handleParcelUpdate);
      };
    }
  }, [socket]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Parcels</span>
          <div className="flex items-center gap-2">
            {isConnected && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-200"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Latest parcel bookings with real-time updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {parcels.map((parcel) => (
            <div
              key={parcel._id}
              className={`transition-all duration-500 ${
                newlyAdded.includes(parcel._id)
                  ? "ring-2 ring-blue-400 bg-blue-50 rounded-lg"
                  : ""
              }`}
            >
              <ParcelCard parcel={parcel} showActions={false} />
              {newlyAdded.includes(parcel._id) && (
                <div className="flex items-center justify-center mt-2">
                  <Badge variant="destructive" className="animate-bounce">
                    <Clock className="w-3 h-3 mr-1" />
                    Just Booked
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>

        {parcels.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent parcels yet</p>
            <p className="text-sm">
              New bookings will appear here in real-time
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
