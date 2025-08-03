import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export interface RealtimeParcel {
  _id: string;
  trackingNumber: string;
  status: string;
  [key: string]: any;
}

export function useRealtimeParcels(initialParcels: RealtimeParcel[] = []) {
  const [parcels, setParcels] = useState<RealtimeParcel[]>(initialParcels);
  const { socket, isConnected } = useSocket();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setParcels(initialParcels);
  }, [initialParcels]);

  // Join user room based on role
  useEffect(() => {
    if (socket && user) {
      if (user.role === "agent") {
        socket.emit("join-agent", user._id);
        console.log(`Agent ${user._id} joined real-time room`);
      } else if (user.role === "customer") {
        socket.emit("join-user", user._id);
        console.log(`Customer ${user._id} joined real-time room`);
      }
    }
  }, [socket, user]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for parcel updates
    const handleParcelUpdate = (data: any) => {
      const { parcel, status } = data;

      setParcels((prevParcels) => {
        const existingIndex = prevParcels.findIndex(
          (p) => p._id === parcel._id
        );

        if (existingIndex !== -1) {
          // Update existing parcel
          const updatedParcels = [...prevParcels];
          updatedParcels[existingIndex] = {
            ...updatedParcels[existingIndex],
            ...parcel,
          };
          return updatedParcels;
        } else {
          // Add new parcel (in case of new assignments)
          return [...prevParcels, parcel];
        }
      });

      // Show toast notification
      toast({
        title: "Parcel Update",
        description: `${parcel.trackingNumber} status: ${status}`,
      });
    };

    // Listen for parcel assignments (for agents)
    const handleParcelAssigned = (data: any) => {
      const { parcel } = data;

      setParcels((prevParcels) => {
        const existingIndex = prevParcels.findIndex(
          (p) => p._id === parcel._id
        );

        if (existingIndex === -1) {
          // Add newly assigned parcel
          return [...prevParcels, parcel];
        }
        return prevParcels;
      });

      toast({
        title: "New Parcel Assigned",
        description: `${parcel.trackingNumber} has been assigned to you`,
      });
    };

    socket.on("parcel-update", handleParcelUpdate);
    socket.on("parcel-assigned", handleParcelAssigned);

    return () => {
      socket.off("parcel-update", handleParcelUpdate);
      socket.off("parcel-assigned", handleParcelAssigned);
    };
  }, [socket, isConnected, toast]);

  return {
    parcels,
    isConnected,
    updateParcel: (parcelId: string, updates: Partial<RealtimeParcel>) => {
      setParcels((prevParcels) =>
        prevParcels.map((p) => (p._id === parcelId ? { ...p, ...updates } : p))
      );
    },
  };
}

// Hook for tracking a specific parcel in real-time
export function useRealtimeParcelTracking(parcelId: string) {
  const [parcel, setParcel] = useState<RealtimeParcel | null>(null);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const { socket, isConnected, joinParcelRoom, leaveParcelRoom } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (parcelId && socket && isConnected) {
      // Join the parcel room for real-time updates
      joinParcelRoom(parcelId);

      return () => {
        leaveParcelRoom(parcelId);
      };
    }
  }, [parcelId, socket, isConnected, joinParcelRoom, leaveParcelRoom]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleStatusUpdate = (data: any) => {
      if (data.parcelId === parcelId) {
        setParcel(data.parcel);

        // Update status history
        setStatusHistory((prev) => [
          {
            status: data.status,
            timestamp: data.timestamp,
            location: data.location,
            notes: data.notes || `Status updated to ${data.status}`,
          },
          ...prev,
        ]);

        toast({
          title: "Status Updated",
          description: `Your parcel is now ${data.status}`,
        });
      }
    };

    const handleLocationUpdate = (data: any) => {
      if (data.parcelId === parcelId) {
        setParcel((prev) =>
          prev
            ? {
                ...prev,
                currentLocation: data.location,
              }
            : null
        );

        toast({
          title: "Location Updated",
          description: `Parcel location: ${data.location.address}`,
        });
      }
    };

    socket.on("parcel-status-updated", handleStatusUpdate);
    socket.on("location-update", handleLocationUpdate);

    return () => {
      socket.off("parcel-status-updated", handleStatusUpdate);
      socket.off("location-update", handleLocationUpdate);
    };
  }, [socket, isConnected, parcelId, toast]);

  return {
    parcel,
    statusHistory,
    isConnected,
    isTracking: isConnected && !!parcelId,
  };
}
