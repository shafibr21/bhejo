"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { ParcelCard } from "@/components/parcels/ParcelCard";
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
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur-sm opacity-25 animate-pulse"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-2xl">
        <div className="p-6 pb-2">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent flex items-center justify-between">
            <span>Recent Parcels</span>
            <div className="flex items-center gap-2">
              {isConnected && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-400 border-green-800/50 bg-green-950/30 border">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                  Live
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Latest parcel bookings with real-time updates
          </p>
        </div>
        <div className="p-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {parcels.map((parcel) => (
              <div
                key={parcel._id}
                className={`transition-all duration-500 ${
                  newlyAdded.includes(parcel._id)
                    ? "ring-2 ring-blue-400/50 bg-blue-950/20 rounded-xl p-2"
                    : ""
                }`}
              >
                <div className="relative group">
                  <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 group-hover:border-slate-600/50 transition-all duration-300">
                    <ParcelCard parcel={parcel} showActions={false} />
                  </div>
                </div>
                {newlyAdded.includes(parcel._id) && (
                  <div className="flex items-center justify-center mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-800/50 animate-bounce">
                      <Clock className="w-3 h-3 mr-1" />
                      Just Booked
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {parcels.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-300 text-lg font-medium mb-2">
                No recent parcels yet
              </p>
              <p className="text-sm text-slate-500">
                New bookings will appear here in real-time
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
