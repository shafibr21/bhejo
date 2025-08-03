"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ParcelStats } from "@/components/agent/ParcelStats";
import { StatusUpdateModal } from "@/components/agent/StatusUpdateModal";
import { DeliveryRoute } from "@/components/agent/DeliveryRoute";
import { AgentParcelGrid } from "@/components/agent/AgentParcelGrid";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import { useParcels } from "@/hooks/useParcels";
import { useRealtimeParcels } from "@/hooks/useRealtimeParcels";

export default function AgentParcels() {
  const { parcels: initialParcels, loading, error, refetch } = useParcels();
  const { parcels, isConnected } = useRealtimeParcels(initialParcels);
  const [selectedParcel, setSelectedParcel] = useState(null);

  const handleUpdateStatus = async (parcel: any) => {
    setSelectedParcel(parcel);
  };

  const handleModalClose = () => {
    setSelectedParcel(null);
  };

  const handleUpdateComplete = () => {
    refetch();
  };

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
      <div className="flex items-center justify-between">
        <PageHeader
          title="My Parcels"
          description="Manage your assigned parcels and update delivery status"
        />
        <ConnectionStatus />
      </div>

      {/* Stats */}
      <ParcelStats parcels={parcels} />

      {/* Delivery Route Optimization */}
      <DeliveryRoute parcels={parcels} />

      {/* Parcels List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentParcelGrid
          parcels={parcels}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        parcel={selectedParcel}
        isOpen={!!selectedParcel}
        onClose={handleModalClose}
        onUpdate={handleUpdateComplete}
      />
    </div>
  );
}
