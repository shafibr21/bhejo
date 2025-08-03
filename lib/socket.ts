import { Server as NetServer } from "http";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: SocketIOServer;

export const initSocket = (server: NetServer): SocketIOServer => {
  if (!io) {
    console.log("Initializing Socket.IO server...");

    io = new SocketIOServer(server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? process.env.NEXTAUTH_URL
            : "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle joining parcel-specific room for real-time updates
      socket.on("join-parcel", (parcelId: string) => {
        socket.join(`parcel-${parcelId}`);
        console.log(
          `Socket ${socket.id} joined parcel room: parcel-${parcelId}`
        );
      });

      // Handle joining user-specific room
      socket.on("join-user", (userId: string) => {
        socket.join(`user-${userId}`);
        console.log(`Socket ${socket.id} joined user room: user-${userId}`);
      });

      // Handle joining agent-specific room
      socket.on("join-agent", (agentId: string) => {
        socket.join(`agent-${agentId}`);
        console.log(`Socket ${socket.id} joined agent room: agent-${agentId}`);
      });

      // Handle leaving rooms
      socket.on("leave-parcel", (parcelId: string) => {
        socket.leave(`parcel-${parcelId}`);
        console.log(`Socket ${socket.id} left parcel room: parcel-${parcelId}`);
      });

      socket.on("disconnect", (reason) => {
        console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
      });
    });
  }

  return io;
};

export const getSocket = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};
