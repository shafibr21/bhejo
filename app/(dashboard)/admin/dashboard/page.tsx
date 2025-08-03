"use client";

import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/hooks/useAuth";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AdminDashboardStats } from "@/components/admin/AdminDashboardStats";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { DashboardLoading } from "@/components/admin/DashboardLoading";
import { DashboardError } from "@/components/admin/DashboardError";
import { ManagementSection } from "@/components/admin/ManagementSection";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { RecentParcels } from "@/components/admin/RecentParcels";
import { LiveNotifications } from "@/components/admin/LiveNotifications";
import { QRCodeGenerator } from "@/components/admin/QRCodeGenerator";
import { LiveMap } from "@/components/maps/LiveMap";

export default function AdminDashboard() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const { analytics, parcels, agents, users, loading, refetch } =
    useAdminDashboard();

  // Join admin room for real-time notifications
  useEffect(() => {
    if (socket && user) {
      socket.emit("join-user", "admin");
      socket.emit("join-user", user._id);
      console.log("Admin joined real-time rooms");
    }
  }, [socket, user]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (!analytics) {
    return <DashboardError />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden rounded-3xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 space-y-8 p-2 md:p-8">
        {/* Dashboard Header */}
        <div className="p-2 md:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10">
          <DashboardHeader />
        </div>

        {/* Dashboard Stats */}
        <div className="p-2 md:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <AdminDashboardStats analytics={analytics} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Management Section */}
          <div className="lg:col-span-2 p-2 md:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
            <ManagementSection
              parcels={parcels}
              agents={agents}
              users={users}
              onAssignmentUpdate={refetch}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Live Notifications */}
            <div className=" p-2 md:p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <LiveNotifications />
            </div>

            {/* QR Code Generator */}
            <div className="p-2 md:p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <QRCodeGenerator parcels={parcels} />
            </div>
          </div>
        </div>

        {/* Dashboard Charts */}
        <div className="p-2 md:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <DashboardCharts statusStats={analytics.statusStats} />
        </div>

        {/* Agent Location Map */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 min-h-[400px]">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                  Live Agent Locations
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/30 min-h-[350px]">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 z-10 pointer-events-none"></div>
                <div className="relative z-20 [&_.gm-style]:!bg-slate-800 [&_.gm-style>div]:!bg-slate-800">
                  <LiveMap
                    parcels={parcels.map((p: any) => ({
                      _id: p._id,
                      trackingNumber: p.trackingNumber,
                      senderAddress: p.senderAddress,
                      recipientAddress: p.recipientAddress,
                      currentLocation: p.currentLocation,
                    }))}
                    showDirections={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Parcels */}
        <div className="p-2 md:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <RecentParcels recentParcels={analytics.recentParcels} />
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="fixed bottom-8 right-8 space-y-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110">
          <div className="w-6 h-6 bg-white rounded-full opacity-80"></div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110">
          <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
        </div>
      </div>
    </div>
  );
}
