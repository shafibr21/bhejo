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
    <div className="space-y-6">
      {/* Real-time Status Bar */}
      <Card>
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Live Updates Active
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      Offline
                    </span>
                  </>
                )}
              </div>

              {newParcelCount > 0 && (
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600 animate-bounce" />
                  <Badge variant="destructive" className="animate-pulse">
                    {newParcelCount} New Parcel{newParcelCount > 1 ? "s" : ""}
                  </Badge>
                </div>
              )}
            </div>

            {newParcelCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={clearNewParcelNotification}
              >
                Clear Notifications
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Management Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unassigned Parcels
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedParcels.length}</div>
            <p className="text-xs text-muted-foreground">
              Require agent assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Original Management Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentAssignment
          parcels={parcels}
          agents={agents}
          onAssignmentUpdate={onAssignmentUpdate}
        />
        <ReportExport parcels={parcels} users={users} />
      </div>
    </div>
  );
}
