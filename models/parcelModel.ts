import mongoose, { Schema, Document } from 'mongoose';

export type ParcelStatus = 'Pending' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Failed';

export interface IParcel extends Document {
  sender: mongoose.Types.ObjectId;
  pickupAddress: string;
  deliveryAddress: string;
  parcelType: string;
  isCOD: boolean;
  amount?: number;
  status: ParcelStatus;
  assignedAgent?: mongoose.Types.ObjectId;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

const ParcelSchema = new Schema<IParcel>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    parcelType: { type: String, required: true },
    isCOD: { type: Boolean, default: false },
    amount: { type: Number },
    status: {
      type: String,
      enum: ['Pending', 'Picked Up', 'In Transit', 'Delivered', 'Failed'],
      default: 'Pending',
    },
    assignedAgent: { type: Schema.Types.ObjectId, ref: 'User' },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Parcel || mongoose.model<IParcel>('Parcel', ParcelSchema);
