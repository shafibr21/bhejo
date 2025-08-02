"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/constants/parcelStatus";
import { useToast } from "@/hooks/use-toast";

interface StatusUpdateModalProps {
  parcel: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function StatusUpdateModal({
  parcel,
  isOpen,
  onClose,
  onUpdate,
}: StatusUpdateModalProps) {
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getAvailableStatuses = (currentStatus: string) => {
    const statusFlow = {
      assigned: ["picked_up"],
      picked_up: ["in_transit"],
      in_transit: ["out_for_delivery"],
      out_for_delivery: ["delivered", "failed"],
      failed: ["out_for_delivery"],
    };
    return statusFlow[currentStatus as keyof typeof statusFlow] || [];
  };

  const handleSubmit = async () => {
    if (!newStatus) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/status/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parcelId: parcel._id,
          status: newStatus,
          notes: `Status updated by agent`,
        }),
      });

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: "Parcel status has been updated successfully",
        });
        onUpdate();
        onClose();
        setNewStatus("");
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update parcel status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Update Parcel Status</CardTitle>
          <CardDescription>
            Update status for {parcel?.trackingNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Current Status:</p>
            <Badge className="mb-4">
              {STATUS_LABELS[parcel?.status as keyof typeof STATUS_LABELS]}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Status:</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableStatuses(parcel?.status || "").map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!newStatus || loading}
              className="flex-1"
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                setNewStatus("");
              }}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
