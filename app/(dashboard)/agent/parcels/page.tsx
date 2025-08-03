"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ParcelStats } from "@/components/agent/ParcelStats";
import { StatusUpdateModal } from "@/components/agent/StatusUpdateModal";
import { DeliveryRoute } from "@/components/agent/DeliveryRoute";
import { LocationSharing } from "@/components/agent/LocationSharing";
import { AgentParcelGrid } from "@/components/agent/AgentParcelGrid";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import { useParcels } from "@/hooks/useParcels";
import { useRealtimeParcels } from "@/hooks/useRealtimeParcels";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function AgentParcels() {
  const { user } = useAuth();
  const { parcels: initialParcels, loading, error, refetch } = useParcels();
  const { parcels, isConnected } = useRealtimeParcels(initialParcels);
  const { location } = useGeolocation();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [assignedParcels, setAssignedParcels] = useState<any[]>([]);

  // Filter parcels assigned to this agent
  useEffect(() => {
    if (parcels && user) {
      const userId = (user as any)?._id || (user as any)?.userId;
      const filtered = parcels.filter(
        (parcel) => parcel.assignedAgent === userId
      );
      setAssignedParcels(filtered);
    }
  }, [parcels, user]);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading parcels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 via-red-500/20 to-red-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-8">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-2 md:p-8 rounded-3xl">
      <div className="space-y-8">
        {/* Header with Connection Status */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                    My Parcels
                  </h1>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                </div>
                <p className="text-slate-400">Manage your assigned parcels and update delivery status</p>
              </div>
              <div className="ml-4">
                <ConnectionStatus />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/20 via-blue-500/20 to-green-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <ParcelStats parcels={assignedParcels} />
          </div>
        </div>

        {/* Location Sharing Controls */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <LocationSharing assignedParcels={assignedParcels} />
          </div>
        </div>

        {/* Delivery Route Optimization */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600/20 via-cyan-500/20 to-orange-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
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
        </div>

        {/* Parcels List */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/20 via-blue-500/20 to-indigo-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AgentParcelGrid
                parcels={assignedParcels}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        <StatusUpdateModal
          parcel={selectedParcel}
          isOpen={!!selectedParcel}
          onClose={handleModalClose}
          onUpdate={handleUpdateComplete}
        />
      </div>
    </div>
  );
}
