"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Package, X, CheckCircle, Truck } from "lucide-react";

interface Notification {
  id: string;
  type: "parcel-booked" | "status-update" | "assignment";
  title: string;
  message: string;
  timestamp: Date;
  parcelId?: string;
  read: boolean;
}

export function LiveNotifications() {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (socket) {
      const handleParcelUpdate = (data: any) => {
        const notification: Notification = {
          id: `${Date.now()}-${Math.random()}`,
          type: "parcel-booked",
          title: "New Parcel Booked",
          message: `Parcel from ${data.parcel.senderAddress} to ${data.parcel.receiverAddress}`,
          timestamp: new Date(),
          parcelId: data.parcelId,
          read: false,
        };

        setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);
      };

      const handleStatusUpdate = (data: any) => {
        const statusMessages = {
          assigned: "Assigned to agent",
          in_transit: "Out for delivery",
          delivered: "Successfully delivered",
          failed: "Delivery failed",
          returned: "Returned to sender",
        };

        const notification: Notification = {
          id: `${Date.now()}-${Math.random()}`,
          type: "status-update",
          title: "Status Updated",
          message: `Parcel ${data.parcelId.slice(-6)} - ${
            statusMessages[data.status as keyof typeof statusMessages] ||
            data.status
          }`,
          timestamp: new Date(),
          parcelId: data.parcelId,
          read: false,
        };

        setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);
      };

      const handleAssignment = (data: any) => {
        const notification: Notification = {
          id: `${Date.now()}-${Math.random()}`,
          type: "assignment",
          title: "Agent Assigned",
          message: `Parcel ${data.parcelId.slice(-6)} assigned to agent`,
          timestamp: new Date(),
          parcelId: data.parcelId,
          read: false,
        };

        setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);
      };

      socket.on("parcel-update", handleParcelUpdate);
      socket.on("parcel-status-updated", handleStatusUpdate);
      socket.on("admin-parcel-update", handleStatusUpdate); // Admin-specific status updates
      socket.on("parcel-assigned", handleAssignment);

      return () => {
        socket.off("parcel-update", handleParcelUpdate);
        socket.off("parcel-status-updated", handleStatusUpdate);
        socket.off("admin-parcel-update", handleStatusUpdate);
        socket.off("parcel-assigned", handleAssignment);
      };
    }
  }, [socket]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "parcel-booked":
        return <Package className="w-4 h-4 text-blue-500" />;
      case "status-update":
        return <Truck className="w-4 h-4 text-green-500" />;
      case "assignment":
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-fit max-h-96 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <span>Live Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isConnected && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-200"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs">Real-time updates will appear here</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b hover:bg-gray-50 transition-colors animate-in slide-in-from-left-4 duration-300 ${
                  !notification.read
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {notification.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
