"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

export function useParcels() {
  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  const fetchParcels = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/parcels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setParcels(data.parcels || []);
      } else {
        setError("Failed to fetch parcels");
      }
    } catch (error) {
      console.error("Error fetching parcels:", error);
      setError("Error loading parcels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  // Join user room and listen for real-time updates
  useEffect(() => {
    if (socket && user) {
      socket.emit("join-user", user._id);

      const handleParcelUpdate = (data: any) => {
        // Update parcels when user's parcels change
        if (data.customerId === user._id) {
          setParcels((prev) => {
            const existingIndex = prev.findIndex(
              (p: any) => p._id === data.parcelId
            );
            if (existingIndex !== -1) {
              // Update existing parcel
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                ...data.parcel,
              };
              return updated;
            } else {
              // Add new parcel if it belongs to this user
              return [data.parcel, ...prev];
            }
          });
        }
      };

      socket.on("parcel-update", handleParcelUpdate);
      socket.on("parcel-status-updated", handleParcelUpdate);

      return () => {
        socket.off("parcel-update", handleParcelUpdate);
        socket.off("parcel-status-updated", handleParcelUpdate);
      };
    }
  }, [socket, user]);

  const refetch = () => {
    fetchParcels();
  };

  return {
    parcels,
    loading,
    error,
    refetch,
  };
}
