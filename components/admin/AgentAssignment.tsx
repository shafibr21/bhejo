"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgentAssignmentProps {
  parcels: any[];
  agents: any[];
  onAssignmentUpdate: () => void;
}

export function AgentAssignment({
  parcels,
  agents,
  onAssignmentUpdate,
}: AgentAssignmentProps) {
  const [selectedParcel, setSelectedParcel] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Filter unassigned parcels
  const unassignedParcels = parcels.filter(
    (p) =>
      p.status === "pending" &&
      p.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignment = async () => {
    if (!selectedParcel || !selectedAgent) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/agents/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parcelId: selectedParcel,
          agentId: selectedAgent,
        }),
      });

      if (response.ok) {
        toast({
          title: "Assignment Successful",
          description: "Parcel has been assigned to the agent",
        });
        setSelectedParcel("");
        setSelectedAgent("");
        onAssignmentUpdate();
      } else {
        throw new Error("Failed to assign parcel");
      }
    } catch (error) {
      console.error("Error assigning parcel:", error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign parcel to agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Agent Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search parcels by tracking number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Assignment Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Parcel</label>
            <Select value={selectedParcel} onValueChange={setSelectedParcel}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a parcel" />
              </SelectTrigger>
              <SelectContent>
                {unassignedParcels.map((parcel) => (
                  <SelectItem key={parcel._id} value={parcel._id}>
                    <div className="flex items-center gap-2">
                      <Package className="h-3 w-3" />
                      {parcel.trackingNumber} - {parcel.recipientName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Agent</label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent._id} value={agent._id}>
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-3 w-3" />
                      {agent.name} ({agent.email})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleAssignment}
          disabled={!selectedParcel || !selectedAgent || loading}
          className="w-full"
        >
          {loading ? "Assigning..." : "Assign Parcel to Agent"}
        </Button>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {unassignedParcels.length}
            </div>
            <div className="text-sm text-gray-600">Unassigned Parcels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {agents.length}
            </div>
            <div className="text-sm text-gray-600">Available Agents</div>
          </div>
        </div>

        {/* Recent Assignments Preview */}
        {unassignedParcels.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Unassigned Parcels</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {unassignedParcels.slice(0, 5).map((parcel) => (
                <div
                  key={parcel._id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3" />
                    <span className="text-sm font-medium">
                      {parcel.trackingNumber}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {parcel.recipientName}
                  </Badge>
                </div>
              ))}
              {unassignedParcels.length > 5 && (
                <div className="text-xs text-gray-500 text-center">
                  +{unassignedParcels.length - 5} more parcels
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
