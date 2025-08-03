export interface Parcel {
  _id: string;
  trackingNumber: string;
  senderId: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientAddress: string;
  parcelType: "document" | "package" | "fragile" | "electronics";
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  paymentType: "cod" | "prepaid";
  codAmount?: number;
  status: ParcelStatus;
  assignedAgent?: string;
  agentName?: string;
  pickupDate?: Date;
  deliveryDate?: Date;
  estimatedDelivery: Date;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  statusHistory: StatusUpdate[];
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ParcelStatus =
  | "pending"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned";

export interface StatusUpdate {
  status: ParcelStatus;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  notes?: string;
  updatedBy: string;
}

export interface BookParcelData {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  parcelType: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  paymentType: "cod" | "prepaid";
  codAmount?: number;
}
