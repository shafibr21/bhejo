"use client"

import { useState, useEffect } from "react"

export function useParcelFilters(parcels: any[]) {
  const [filteredParcels, setFilteredParcels] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    filterParcels()
  }, [parcels, searchTerm, statusFilter])

  const filterParcels = () => {
    let filtered = parcels

    // Filter by search term (tracking number or recipient name)
    if (searchTerm) {
      filtered = filtered.filter((parcel: any) =>
        parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((parcel: any) => parcel.status === statusFilter)
    }

    setFilteredParcels(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

  return {
    filteredParcels,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    clearFilters,
  }
}
