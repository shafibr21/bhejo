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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_LABELS } from "@/constants/parcelStatus";
import { useToast } from "@/hooks/use-toast";
import { BarcodeScanner } from "./BarcodeScanner";
import { Mail, MessageSquare, Camera, Package2 } from "lucide-react";

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
  const [notes, setNotes] = useState("");
  const [sendNotifications, setSendNotifications] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(true);
  const [scanConfirmed, setScanConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
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

  const requiresBarcodeConfirmation = (status: string) => {
    return ["picked_up", "delivered"].includes(status);
  };

  const getNotificationType = (status: string) => {
    if (status === "picked_up") return "pickup_confirmation";
    if (status === "delivered") return "delivery_confirmation";
    return "status_update";
  };

  const handleScanSuccess = (
    trackingNumber: string,
    action: "pickup" | "delivery"
  ) => {
    if (trackingNumber === parcel.trackingNumber) {
      setScanConfirmed(true);
      toast({
        title: "Scan Confirmed",
        description: `${
          action === "pickup" ? "Pickup" : "Delivery"
        } confirmed for ${trackingNumber}`,
      });
      setActiveTab("status");
    } else {
      toast({
        title: "Scan Error",
        description: "Scanned tracking number doesn't match this parcel",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!newStatus) return;

    // Check if barcode confirmation is required
    if (requiresBarcodeConfirmation(newStatus) && !scanConfirmed) {
      toast({
        title: "Barcode Confirmation Required",
        description: "Please scan the parcel barcode to confirm this action",
        variant: "destructive",
      });
      setActiveTab("scan");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Update parcel status
      const statusResponse = await fetch("/api/status/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parcelId: parcel._id,
          status: newStatus,
          notes: notes || `Status updated by agent`,
          scanConfirmed,
        }),
      });

      if (!statusResponse.ok) {
        throw new Error("Failed to update status");
      }

      // Send notifications if enabled
      if (sendNotifications) {
        const notificationResponse = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            trackingNumber: parcel.trackingNumber,
            type: getNotificationType(newStatus),
            sendEmail,
            sendSMS,
          }),
        });

        if (notificationResponse.ok) {
          const notificationResult = await notificationResponse.json();
          const { email, sms } = notificationResult.results;

          if (email || sms) {
            toast({
              title: "Status Updated & Notifications Sent",
              description: `Parcel status updated. ${email ? "Email" : ""}${
                email && sms ? " and " : ""
              }${sms ? "SMS" : ""} sent to customer.`,
            });
          } else {
            toast({
              title: "Status Updated",
              description:
                "Parcel status updated. Notifications could not be sent.",
            });
          }
        }
      } else {
        toast({
          title: "Status Updated",
          description: "Parcel status has been updated successfully",
        });
      }

      onUpdate();
      onClose();
      resetForm();
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

  const resetForm = () => {
    setNewStatus("");
    setNotes("");
    setSendNotifications(true);
    setSendEmail(true);
    setSendSMS(true);
    setScanConfirmed(false);
    setActiveTab("status");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            Update Parcel Status
          </CardTitle>
          <CardDescription>
            Update status for {parcel?.trackingNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="status">Status Update</TabsTrigger>
              <TabsTrigger value="scan">
                <Camera className="h-4 w-4 mr-2" />
                Scan Confirm
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Mail className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-4">
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
                    {getAvailableStatuses(parcel?.status || "").map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                          {requiresBarcodeConfirmation(status) && (
                            <span className="ml-2 text-xs text-orange-600">
                              (Scan Required)
                            </span>
                          )}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional):</label>
                <Textarea
                  placeholder="Add any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {requiresBarcodeConfirmation(newStatus) && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Barcode confirmation required for this status
                    </span>
                  </div>
                  {scanConfirmed ? (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Scan confirmed
                    </p>
                  ) : (
                    <p className="text-sm text-orange-600 mt-1">
                      Please scan the parcel barcode to proceed
                    </p>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scan">
              <BarcodeScanner
                onScanSuccess={handleScanSuccess}
                expectedAction={
                  newStatus === "picked_up" ? "pickup" : "delivery"
                }
              />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-notifications"
                  checked={sendNotifications}
                  onCheckedChange={(checked) => setSendNotifications(!!checked)}
                />
                <label
                  htmlFor="send-notifications"
                  className="text-sm font-medium"
                >
                  Send customer notifications
                </label>
              </div>

              {sendNotifications && (
                <div className="pl-6 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="send-email"
                      checked={sendEmail}
                      onCheckedChange={(checked) => setSendEmail(!!checked)}
                    />
                    <label htmlFor="send-email" className="text-sm">
                      Email notification
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="send-sms"
                      checked={sendSMS}
                      onCheckedChange={(checked) => setSendSMS(!!checked)}
                    />
                    <label htmlFor="send-sms" className="text-sm">
                      SMS notification
                    </label>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      Customer will receive:{" "}
                      {getNotificationType(newStatus).replace("_", " ")}{" "}
                      notification
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-6 border-t">
            <Button
              onClick={handleSubmit}
              disabled={
                !newStatus ||
                loading ||
                (requiresBarcodeConfirmation(newStatus) && !scanConfirmed)
              }
              className="flex-1"
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                resetForm();
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
