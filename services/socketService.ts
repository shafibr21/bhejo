import { Server as SocketIOServer } from "socket.io";

export interface ParcelUpdateEvent {
  parcelId: string;
  status: string;
  timestamp: Date;
  parcel: any;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  agentId?: string;
  customerId?: string;
}

export class SocketService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  // Emit parcel status update to all relevant parties
  emitParcelUpdate(data: ParcelUpdateEvent) {
    const { parcelId, parcel, customerId, agentId } = data;

    // Emit to parcel-specific room (anyone tracking this parcel)
    this.io.to(`parcel-${parcelId}`).emit("parcel-status-updated", data);

    // Emit to customer
    if (customerId) {
      this.io.to(`user-${customerId}`).emit("parcel-update", data);
      this.io.to(`user-${customerId}`).emit("parcel-status-updated", data);
    }

    // Emit to agent
    if (agentId) {
      this.io.to(`agent-${agentId}`).emit("parcel-update", data);
      this.io.to(`agent-${agentId}`).emit("parcel-status-updated", data);
    }

    // Emit to all admins - broadcast to all clients
    this.io.emit("admin-parcel-update", data);
    this.io.emit("parcel-status-updated", data);

    console.log(`Emitted parcel update for ${parcelId}:`, data.status);
  }

  // Emit new parcel assignment to agent
  emitParcelAssignment(parcelId: string, agentId: string, parcel: any) {
    this.io.to(`agent-${agentId}`).emit("parcel-assigned", {
      parcelId,
      parcel,
      timestamp: new Date(),
    });

    console.log(`Emitted parcel assignment: ${parcelId} to agent ${agentId}`);
  }

  // Emit location update
  emitLocationUpdate(
    parcelId: string,
    location: { lat: number; lng: number; address: string }
  ) {
    this.io.to(`parcel-${parcelId}`).emit("location-update", {
      parcelId,
      location,
      timestamp: new Date(),
    });

    console.log(`Emitted location update for ${parcelId}:`, location.address);
  }
}

// Helper function to get socket service instance
export function getSocketService(): SocketService | null {
  if (global.io) {
    return new SocketService(global.io);
  }
  return null;
}
