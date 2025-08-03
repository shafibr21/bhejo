"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ParcelStats } from "@/components/agent/ParcelStats";
import { DeliveryRoute } from "@/components/agent/DeliveryRoute";
import { LocationSharing } from "@/components/agent/LocationSharing";
import { useParcels } from "@/hooks/useParcels";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function AgentDashboard() {
  const { user } = useAuth();
  const { parcels: initialParcels, loading, error } = useParcels();
  const { location } = useGeolocation();
  const [assignedParcels, setAssignedParcels] = useState<any[]>([]);

  // Filter parcels assigned to this agent
  useEffect(() => {
    if (initialParcels && user) {
      const userId = (user as any)?._id || (user as any)?.userId;
      const filtered = initialParcels.filter(
        (parcel) => parcel.assignedAgent === userId
      );
      setAssignedParcels(filtered);
    }
  }, [initialParcels, user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Dashboard"
        description="Manage your deliveries, route optimization, and location sharing"
      />

      {/* Stats */}
      <ParcelStats parcels={assignedParcels} />

      {/* Location Sharing Controls */}
      <LocationSharing assignedParcels={assignedParcels} />

      {/* Delivery Route Optimization */}
      <DeliveryRoute
        assignedParcels={assignedParcels}
        agentLocation={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                updatedAt: new Date(),
              }
            : undefined
        }
      />
    </div>
  );
}
