"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/hooks/use-toast";
import { AgentAssignment } from "@/components/admin/AgentAssignment";
import { ReportExport } from "@/components/admin/ReportExport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Users, UserCheck, Bell, Wifi, WifiOff } from "lucide-react";

interface ManagementSectionProps {
  parcels: any[];
  agents: any[];
  users: any[];
  onAssignmentUpdate: () => Promise<void>;
}

export function ManagementSection({
  parcels: initialParcels,
  agents,
  users,
  onAssignmentUpdate,
}: ManagementSectionProps) {
  const { socket, isConnected } = useSocket();
  const { toast } = useToast();
  const [parcels, setParcels] = useState(initialParcels);
  const [newParcelCount, setNewParcelCount] = useState(0);

  // Update parcels when initial data changes
  useEffect(() => {
    setParcels(initialParcels);
  }, [initialParcels]);

  // Listen for real-time parcel updates
  useEffect(() => {
    if (socket) {
      // Listen for new parcel bookings
      const handleParcelBooked = (data: any) => {
        setParcels((prev) => [data.parcel, ...prev]);
        setNewParcelCount((prev) => prev + 1);

        toast({
          title: "New Parcel Booked",
          description: `${data.parcel.trackingNumber} booked by ${data.parcel.senderName}`,
          className: "bg-blue-50 border-blue-200",
        });
      };

      // Listen for parcel status updates
      const handleParcelUpdate = (data: any) => {
        setParcels((prev) =>
          prev.map((parcel) =>
            parcel._id === data.parcelId
              ? { ...parcel, status: data.status, updatedAt: data.timestamp }
              : parcel
          )
        );
      };

      // Listen for agent assignments
      const handleParcelAssigned = (data: any) => {
        setParcels((prev) =>
          prev.map((parcel) =>
            parcel._id === data.parcelId
              ? {
                  ...parcel,
                  assignedAgent: data.agentId,
                  agentName: data.agentName,
                }
              : parcel
          )
        );
      };

      // Listen for admin-specific events
      socket.on("parcel-update", handleParcelBooked);
      socket.on("parcel-status-updated", handleParcelUpdate);
      socket.on("admin-parcel-update", handleParcelUpdate); // Admin-specific status updates
      socket.on("parcel-assigned", handleParcelAssigned);

      return () => {
        socket.off("parcel-update", handleParcelBooked);
        socket.off("parcel-status-updated", handleParcelUpdate);
        socket.off("admin-parcel-update", handleParcelUpdate);
        socket.off("parcel-assigned", handleParcelAssigned);
      };
    }
  }, [socket, toast]);

  const clearNewParcelNotification = () => {
    setNewParcelCount(0);
  };

  const unassignedParcels = parcels.filter(
    (parcel) => parcel.status === "pending" && !parcel.assignedAgent
  );

  return (
    <div className="space-y-8">
      {/* Real-time Status Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Connection Status */}
            <div className="flex items-center gap-3">
              {isConnected ? (
                <>
                  <div className="relative">
                    <Wifi className="h-5 w-5 text-green-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-green-400">Live Updates Active</span>
                    <span className="text-xs text-white/50">Real-time monitoring</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <WifiOff className="h-5 w-5 text-red-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-red-400">Offline</span>
                    <span className="text-xs text-white/50">No connection</span>
                  </div>
                </>
              )}
            </div>

            {/* New Parcel Notifications */}
            {newParcelCount > 0 && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30">
                <Bell className="h-4 w-4 text-blue-400 animate-bounce" />
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold animate-pulse">
                    {newParcelCount}
                  </span>
                  <span className="text-sm font-medium text-blue-300">
                    New Parcel{newParcelCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Clear Notifications Button */}
          {newParcelCount > 0 && (
            <button
              onClick={clearNewParcelNotification}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-white/20 hover:border-white/30 text-white/80 hover:text-white text-sm font-medium transition-all duration-200"
            >
              Clear Notifications
            </button>
          )}
        </div>
      </div>

      {/* Management Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Unassigned Parcels */}
        <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all duration-300">
              <Package className="h-6 w-6 text-orange-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{unassignedParcels.length}</div>
              <div className="text-sm font-medium text-orange-300">Unassigned</div>
            </div>
          </div>
          <p className="text-sm text-white/70">Require agent assignment</p>
          <div className="mt-3 w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-1000" style={{width: `${Math.min((unassignedParcels.length / Math.max(parcels.length, 1)) * 100, 100)}%`}}></div>
          </div>
        </div>

        {/* Active Agents */}
        <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
              <UserCheck className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{agents.length}</div>
              <div className="text-sm font-medium text-green-300">Active</div>
            </div>
          </div>
          <p className="text-sm text-white/70">Available for assignments</p>
          <div className="mt-3 w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-1000" style={{width: `85%`}}></div>
          </div>
        </div>

        {/* Total Users */}
        <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <div className="text-sm font-medium text-blue-300">Users</div>
            </div>
          </div>
          <p className="text-sm text-white/70">Registered customers</p>
          <div className="mt-3 w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000" style={{width: `70%`}}></div>
          </div>
        </div>
      </div>

      {/* Management Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Assignment Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <AgentAssignment
            parcels={parcels}
            agents={agents}
            onAssignmentUpdate={onAssignmentUpdate}
          />
        </div>

        {/* Report Export Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
          <ReportExport parcels={parcels} users={users} />
        </div>
      </div>
    </div>
  );
}
