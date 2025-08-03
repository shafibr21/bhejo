"use client";

import { BookParcelForm } from "@/components/forms/BookParcelForm";
import { CheckCircle, QrCode } from "lucide-react";
import { useState } from "react";
import { QRCodeDisplay } from "@/components/parcels/QRCodeDisplay";

export default function BookParcel() {
  const [bookedParcel, setBookedParcel] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleBookingSuccess = (parcel: any) => {
    setBookedParcel(parcel);
  };

  if (bookedParcel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/20 via-blue-500/20 to-green-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-8">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur opacity-50"></div>
                    <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-center mb-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent">
                    Parcel Booked Successfully!
                  </h1>
                  <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 to-transparent"></div>
                </div>
                <p className="text-slate-400">Your parcel has been registered for pickup</p>
              </div>

              {/* Booking Details */}
              <div className="relative mb-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/10 via-slate-500/10 to-blue-600/10 rounded-xl blur opacity-30"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Booking Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                      <span className="text-slate-400 font-medium">Tracking Number:</span>
                      <span className="text-slate-200 font-mono bg-slate-800/60 px-3 py-1 rounded-md border border-slate-700/50">
                        {(bookedParcel as any).trackingNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                      <span className="text-slate-400 font-medium">Sender:</span>
                      <span className="text-slate-200">{(bookedParcel as any).senderName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                      <span className="text-slate-400 font-medium">Recipient:</span>
                      <span className="text-slate-200">{(bookedParcel as any).recipientName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400 font-medium">Status:</span>
                      <span className="px-3 py-1 bg-yellow-900/30 text-yellow-300 border border-yellow-800/50 rounded-md text-sm font-medium">
                        Pending Pickup
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center mb-6">
                <button
                  onClick={() => setBookedParcel(null)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500/90 hover:to-purple-500/90 text-white rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 font-medium"
                >
                  Book Another Parcel
                </button>
                <button
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="px-6 py-3 bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 text-white rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  {showQRCode ? "Hide" : "Show"} QR Code
                </button>
              </div>

              {/* QR Code Display */}
              {showQRCode && (
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 via-blue-500/10 to-purple-600/10 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <QRCodeDisplay
                      trackingNumber={(bookedParcel as any).trackingNumber}
                      parcelData={{
                        _id: (bookedParcel as any)._id,
                        senderName: (bookedParcel as any).senderName,
                        recipientName: (bookedParcel as any).recipientName,
                        status: "pending",
                      }}
                      size="md"
                      showDownload={true}
                      showShare={true}
                      className="border-0 shadow-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-2 md:p-7 rounded-3xl">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl p-3 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Book a Parcel
              </h1>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            <p className="text-slate-400">Schedule a pickup for your parcel delivery</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <BookParcelForm onSuccess={handleBookingSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
