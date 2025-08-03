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
    <Card className="h-fit max-h-[28rem] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-blue-800/30 shadow-2xl backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-blue-300" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xs font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </div>
            <span className="text-white font-semibold text-base sm:text-lg">Live Notifications</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isConnected && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                <span className="text-xs font-medium">Live</span>
              </Badge>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-blue-300 hover:text-white hover:bg-blue-800/30 transition-all duration-200 text-xs px-3 py-1"
              >
                Clear All
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-blue-600">
          {notifications.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="relative mb-4">
                <Bell className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
              </div>
              <p className="text-sm sm:text-base text-slate-300 mb-2 font-medium">No notifications yet</p>
              <p className="text-xs sm:text-sm text-slate-500">Real-time updates will appear here</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`relative p-3 sm:p-4 border-b border-slate-700/50 hover:bg-gradient-to-r hover:from-blue-800/20 hover:to-slate-800/30 transition-all duration-300 transform hover:scale-[1.01] ${
                    !notification.read
                      ? "bg-gradient-to-r from-blue-900/40 to-purple-900/20 border-l-4 border-l-blue-400 shadow-lg"
                      : "hover:bg-slate-800/20"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {!notification.read && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
                  )}
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 shadow-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-white truncate mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 p-0 text-blue-400 hover:text-white hover:bg-blue-600/30 transition-all duration-200 rounded-full"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
