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
    <div >
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-slate-800/90 backdrop-blur-xl border-blue-500/30 shadow-2xl shadow-blue-500/10">
          <CardHeader className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/30">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 mt-2 rounded-xl bg-blue-500/20 border border-blue-400/30">
                <UserPlus className="h-6 w-6 text-blue-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                Agent Assignment
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-2 space-y-2 lg:p-6">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400/70 group-focus-within:text-blue-300 transition-colors" />
              <Input
                placeholder="Search parcels by tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-slate-800/50 border-blue-500/30 text-slate-100 placeholder-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20 h-12 rounded-xl"
              />
            </div>

            {/* Assignment Form */}
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4 md:grid-cols-1 ">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-blue-200">Select Parcel</label>
                <Select value={selectedParcel} onValueChange={setSelectedParcel}>
                  <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-slate-100 focus:border-blue-400/50 focus:ring-blue-400/20 h-12 rounded-xl">
                    <SelectValue placeholder="Choose a parcel" className="text-slate-400" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-blue-500/30 rounded-xl">
                    {unassignedParcels.map((parcel) => (
                      <SelectItem 
                        key={parcel._id} 
                        value={parcel._id}
                        className="text-slate-100 focus:bg-blue-900/50 focus:text-blue-200"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3 text-blue-400" />
                          <span>{parcel.trackingNumber} - {parcel.recipientName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-blue-200">Select Agent</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-slate-100 focus:border-blue-400/50 focus:ring-blue-400/20 h-12 rounded-xl">
                    <SelectValue placeholder="Choose an agent" className="text-slate-400" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-blue-500/30 rounded-xl">
                    {agents.map((agent) => (
                      <SelectItem 
                        key={agent._id} 
                        value={agent._id}
                        className="text-slate-100 focus:bg-blue-900/50 focus:text-blue-200"
                      >
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-3 w-3 text-blue-400" />
                          <span>{agent.name} ({agent.email})</span>
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
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Assigning...
                </div>
              ) : (
                "Assign Parcel to Agent"
              )}
            </Button>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-blue-500/30">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  {unassignedParcels.length}
                </div>
                <div className="text-sm text-blue-200/80 font-medium">Unassigned Parcels</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-600/20 to-emerald-700/10 border border-emerald-500/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  {agents.length}
                </div>
                <div className="text-sm text-emerald-200/80 font-medium">Available Agents</div>
              </div>
            </div>

            {/* Recent Assignments Preview */}
            {unassignedParcels.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-blue-200 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Unassigned Parcels
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-slate-800/50">
                  {unassignedParcels.slice(0, 5).map((parcel) => (
                    <div
                      key={parcel._id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/60 to-blue-900/30 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                          <Package className="h-3 w-3 text-blue-300" />
                        </div>
                        <span className="text-sm font-semibold text-slate-100">
                          {parcel.trackingNumber}
                        </span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-blue-500/20 border-blue-400/40 text-blue-200 hover:bg-blue-500/30"
                      >
                        {parcel.recipientName}
                      </Badge>
                    </div>
                  ))}
                  {unassignedParcels.length > 5 && (
                    <div className="text-xs text-blue-300/60 text-center py-2">
                      +{unassignedParcels.length - 5} more parcels
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
