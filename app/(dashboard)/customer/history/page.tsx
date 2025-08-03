"use client";

import { HistoryStats } from "@/components/customer/HistoryStats";
import { ParcelFilters } from "@/components/customer/ParcelFilters";
import { FilterResultsInfo } from "@/components/customer/FilterResultsInfo";
import { ParcelGrid } from "@/components/customer/ParcelGrid";
import { useParcels } from "@/hooks/useParcels";
import { useParcelFilters } from "@/hooks/useParcelFilters";

export default function CustomerHistory() {
  const { parcels, loading, error } = useParcels();
  const {
    filteredParcels,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
  } = useParcelFilters(parcels);

  const getStatusStats = () => {
    return {
      total: parcels.length,
      pending: parcels.filter((p: any) => p.status === "pending").length,
      in_transit: parcels.filter((p: any) => p.status === "in_transit").length,
      delivered: parcels.filter((p: any) => p.status === "delivered").length,
      failed: parcels.filter((p: any) => p.status === "failed").length,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your booking history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-8">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 via-red-500/20 to-red-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-8">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Booking History
              </h1>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            <p className="text-slate-400">
              View all your parcel bookings and their current status
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        {parcels.length > 0 && (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/20 via-blue-500/20 to-green-600/20 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <HistoryStats stats={stats} />
            </div>
          </div>
        )}

        {/* Filters */}
        {parcels.length > 0 && (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <ParcelFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
              />
            </div>
          </div>
        )}

        {/* Parcels Grid */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/20 via-blue-500/20 to-indigo-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ParcelGrid
                filteredParcels={filteredParcels}
                totalParcels={parcels.length}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
