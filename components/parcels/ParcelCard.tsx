"use client";

import { useState } from "react";
import {
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Truck,
  QrCode,
} from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/parcelStatus";
import { QRCodeDisplay } from "@/components/parcels/QRCodeDisplay";
import type { Parcel } from "@/types/parcel";

interface ParcelCardProps {
  parcel: Parcel;
  onTrack?: (parcel: Parcel) => void;
  onUpdateStatus?: (parcel: Parcel) => void;
  showActions?: boolean;
  showQRCode?: boolean;
}

export function ParcelCard({
  parcel,
  onTrack,
  onUpdateStatus,
  showActions = true,
  showQRCode = true,
}: ParcelCardProps) {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-xl shadow-lg w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-xl blur opacity-50"></div>
          <div className="relative">
            <div className="p-4 sm:p-6 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-400" />
                  {parcel.trackingNumber}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    STATUS_COLORS[parcel.status]
                  }`}
                >
                  {STATUS_LABELS[parcel.status]}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-6 pt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2 text-slate-300">
                    <User className="h-4 w-4 text-blue-400" />
                    Sender
                  </h4>
                  <div className="space-y-2 pl-6">
                    <p className="text-sm text-slate-200">
                      {parcel.senderName}
                    </p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {parcel.senderPhone}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2 text-slate-300">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                    Recipient
                  </h4>
                  <div className="space-y-2 pl-6">
                    <p className="text-sm text-slate-200">
                      {parcel.recipientName}
                    </p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {parcel.recipientPhone}
                    </p>
                    {parcel.recipientEmail && (
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {parcel.recipientEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="text-sm">
                  <span className="font-medium text-slate-300">Type:</span>
                  <span className="text-slate-400 ml-2">
                    {parcel.parcelType}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-300">Weight:</span>
                  <span className="text-slate-400 ml-2">
                    {parcel.weight} kg
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-300">Payment:</span>
                  <span className="text-slate-400 ml-2">
                    {parcel.paymentType.toUpperCase()}
                    {parcel.paymentType === "cod" &&
                      parcel.codAmount &&
                      ` (৳${parcel.codAmount})`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>Created: {formatDate(parcel.createdAt)}</span>
                </div>
                {parcel.assignedAgent && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-slate-500" />
                    <span>Agent: {parcel.agentName}</span>
                  </div>
                )}
              </div>

              {showActions && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800/50">
                  {onTrack && (
                    <button
                      className="inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 px-3 py-2 text-sm bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:text-white"
                      onClick={() => onTrack(parcel)}
                    >
                      Track
                    </button>
                  )}
                  {onUpdateStatus && (
                    <button
                      className="inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 px-3 py-2 text-sm bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:text-white"
                      onClick={() => onUpdateStatus(parcel)}
                    >
                      Update Status
                    </button>
                  )}
                  {showQRCode && (
                    <>
                      <button
                        className="inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 px-3 py-2 text-sm bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:text-white"
                        onClick={() => setQrDialogOpen(true)}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Code
                      </button>
                      {qrDialogOpen && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                          <div className="relative max-w-md w-full">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl blur opacity-25"></div>
                            <div className="relative bg-slate-900/95 backdrop-blur-sm border border-slate-800/50 rounded-xl shadow-2xl p-6">
                              <button
                                onClick={() => setQrDialogOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
                              >
                                ×
                              </button>
                              <div className="pr-8">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                  QR Code - {parcel.trackingNumber}
                                </h3>
                                <p className="text-sm text-slate-400 mb-4">
                                  Scan to track this parcel
                                </p>
                                <div className="flex justify-center">
                                  <QRCodeDisplay
                                    trackingNumber={parcel.trackingNumber}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
