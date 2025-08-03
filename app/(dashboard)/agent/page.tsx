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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading dashboard...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Agent Dashboard
              </h1>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            <p className="text-slate-400">
              Manage your deliveries, route optimization, and location sharing
            </p>
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
      </div>
    </div>
  );
}
