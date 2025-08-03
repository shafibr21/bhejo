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
    <div className="space-y-6">
      <DashboardHeader />

      <AdminDashboardStats analytics={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ManagementSection
            parcels={parcels}
            agents={agents}
            users={users}
            onAssignmentUpdate={refetch}
          />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <LiveNotifications />
          <QRCodeGenerator parcels={parcels} />
        </div>
      </div>

      <DashboardCharts statusStats={analytics.statusStats} />

      {/* Agent Location Map */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Live Agent Tracking</h2>
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

      <RecentParcels recentParcels={analytics.recentParcels} />
    </div>
  );
}
