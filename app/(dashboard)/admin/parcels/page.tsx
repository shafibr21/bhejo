"use client";

import { useEffect, useState } from "react";
import { ParcelCard } from "@/components/parcels/ParcelCard";
import { Search, Filter, Package } from "lucide-react";
import { PARCEL_STATUS } from "@/constants/parcelStatus";

export default function AdminParcels() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Updated default value to "all"
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchParcels();
  }, [pagination.page, statusFilter]);

  const fetchParcels = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/parcels?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setParcels(data.parcels);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching parcels:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParcels = parcels.filter(
    (parcel: any) =>
      parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 rounded-3xl shadow-lg">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-400 to-cyan-200 bg-clip-text text-transparent">
            Parcel Management
          </h1>
          <p className="text-slate-400">Manage all parcels in the system</p>
        </div>

        {/* Filters */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                  Filters
                </h3>
                <Filter className="h-5 w-5 text-blue-400" />
                <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      placeholder="Search by tracking number, sender, or recipient..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-10 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    {Object.entries(PARCEL_STATUS).map(([key, value]) => (
                      <option
                        key={key}
                        value={value}
                        className="bg-slate-800 text-slate-100"
                      >
                        {key.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parcels List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParcels.length > 0 ? (
            filteredParcels.map((parcel: any) => (
              <ParcelCard key={parcel._id} parcel={parcel} />
            ))
          ) : (
            <div className="col-span-full">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl">
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <Package className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                      No parcels found
                    </h3>
                    <p className="text-slate-400 text-center">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              className="inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 px-4 py-2 bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span className="flex items-center px-4 text-slate-300">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              className="inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 px-4 py-2 bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.pages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
