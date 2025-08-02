"use client"

import { PageHeader } from "@/components/ui/PageHeader"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { HistoryStats } from "@/components/customer/HistoryStats"
import { ParcelFilters } from "@/components/customer/ParcelFilters"
import { FilterResultsInfo } from "@/components/customer/FilterResultsInfo"
import { ParcelGrid } from "@/components/customer/ParcelGrid"
import { useParcels } from "@/hooks/useParcels"
import { useParcelFilters } from "@/hooks/useParcelFilters"

export default function CustomerHistory() {
  const { parcels, loading, error } = useParcels()
  const {
    filteredParcels,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
  } = useParcelFilters(parcels)

  const getStatusStats = () => {
    return {
      total: parcels.length,
      pending: parcels.filter((p: any) => p.status === "pending").length,
      in_transit: parcels.filter((p: any) => p.status === "in_transit").length,
      delivered: parcels.filter((p: any) => p.status === "delivered").length,
      failed: parcels.filter((p: any) => p.status === "failed").length,
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking History"
        description="View all your parcel bookings and their current status"
      />

      {/* Quick Stats */}
      {parcels.length > 0 && <HistoryStats stats={stats} />}

      {/* Filters */}
      {parcels.length > 0 && (
        <ParcelFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />
      )}

      {/* Results Info */}
      {parcels.length > 0 && (
        <FilterResultsInfo
          totalParcels={parcels.length}
          filteredCount={filteredParcels.length}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      )}

      {/* Parcels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ParcelGrid
          filteredParcels={filteredParcels}
          totalParcels={parcels.length}
        />
      </div>
    </div>
  )
}
