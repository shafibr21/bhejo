"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinParcelRoom: (parcelId: string) => void;
  leaveParcelRoom: (parcelId: string) => void;
  joinUserRoom: (userId: string) => void;
  joinAgentRoom: (agentId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinParcelRoom: () => {},
  leaveParcelRoom: () => {},
  joinUserRoom: () => {},
  joinAgentRoom: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const socketInstance = io({
        transports: ["websocket", "polling"],
      });

      socketInstance.on("connect", () => {
        console.log("Connected to Socket.IO server:", socketInstance.id);
        setIsConnected(true);

        // Automatically join user room based on role
        if (user._id) {
          socketInstance.emit("join-user", user._id);

          if (user.role === "agent") {
            socketInstance.emit("join-agent", user._id);
          }
        }
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("Disconnected from Socket.IO server:", reason);
        setIsConnected(false);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
      });

      setSocket(socketInstance);

      return () => {
        console.log("Cleaning up socket connection");
        socketInstance.disconnect();
      };
    }
  }, [user]);

  const joinParcelRoom = (parcelId: string) => {
    if (socket) {
      socket.emit("join-parcel", parcelId);
    }
  };

  const leaveParcelRoom = (parcelId: string) => {
    if (socket) {
      socket.emit("leave-parcel", parcelId);
    }
  };

  const joinUserRoom = (userId: string) => {
    if (socket) {
      socket.emit("join-user", userId);
    }
  };

  const joinAgentRoom = (agentId: string) => {
    if (socket) {
      socket.emit("join-agent", agentId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinParcelRoom,
        leaveParcelRoom,
        joinUserRoom,
        joinAgentRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
