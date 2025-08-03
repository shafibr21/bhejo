"use client";

import type React from "react";

import { useState } from "react";
import { Package, MapPin, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookParcelFormProps {
  onSuccess?: (parcel: any) => void;
}

export function BookParcelForm({ onSuccess }: BookParcelFormProps) {
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    recipientAddress: "",
    parcelType: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    paymentType: "prepaid" as "cod" | "prepaid",
    codAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/parcels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          weight: Number.parseFloat(formData.weight),
          dimensions: {
            length: Number.parseFloat(formData.dimensions.length),
            width: Number.parseFloat(formData.dimensions.width),
            height: Number.parseFloat(formData.dimensions.height),
          },
          codAmount:
            formData.paymentType === "cod"
              ? Number.parseFloat(formData.codAmount)
              : 0,
        }),
      });

      if (response.ok) {
        const { parcel } = await response.json();
        toast({
          title: "Parcel Booked Successfully!",
          description: `Tracking Number: ${parcel.trackingNumber}`,
        });
        onSuccess?.(parcel);
        // Reset form
        setFormData({
          senderName: "",
          senderPhone: "",
          senderAddress: "",
          recipientName: "",
          recipientPhone: "",
          recipientEmail: "",
          recipientAddress: "",
          parcelType: "",
          weight: "",
          dimensions: { length: "", width: "", height: "" },
          paymentType: "prepaid",
          codAmount: "",
        });
      } else {
        const { error } = await response.json();
        setError(error || "Failed to book parcel");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-6">
      

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 via-red-500/20 to-red-600/20 rounded-xl blur opacity-30"></div>
            <div className="relative bg-red-950/30 backdrop-blur-sm border border-red-800/50 rounded-xl p-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Sender Information */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 rounded-xl blur opacity-30"></div>
          <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-400" />
              Sender Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="senderName" className="text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <input
                  id="senderName"
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange("senderName", e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="senderPhone" className="text-sm font-medium text-slate-300">
                  Phone Number
                </label>
                <input
                  id="senderPhone"
                  type="tel"
                  value={formData.senderPhone}
                  onChange={(e) => handleInputChange("senderPhone", e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="senderAddress" className="text-sm font-medium text-slate-300">
                Pickup Address
              </label>
              <textarea
                id="senderAddress"
                value={formData.senderAddress}
                onChange={(e) => handleInputChange("senderAddress", e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                placeholder="Enter pickup address"
              />
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/10 via-emerald-500/10 to-green-600/10 rounded-xl blur opacity-30"></div>
          <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-green-400" />
              Recipient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="recipientName" className="text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <input
                  id="recipientName"
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange("recipientName", e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="recipientPhone" className="text-sm font-medium text-slate-300">
                  Phone Number
                </label>
                <input
                  id="recipientPhone"
                  type="tel"
                  value={formData.recipientPhone}
                  onChange={(e) => handleInputChange("recipientPhone", e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="recipientEmail" className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                id="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                placeholder="recipient@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="recipientAddress" className="text-sm font-medium text-slate-300">
                Delivery Address
              </label>
              <textarea
                id="recipientAddress"
                value={formData.recipientAddress}
                onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 resize-none"
                placeholder="Enter delivery address"
              />
            </div>
          </div>
        </div>

        {/* Parcel Details */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600/10 via-yellow-500/10 to-orange-600/10 rounded-xl blur opacity-30"></div>
          <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-orange-400" />
              Parcel Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="parcelType" className="text-sm font-medium text-slate-300">
                  Parcel Type
                </label>
                <div className="relative">
                  <select
                    id="parcelType"
                    value={formData.parcelType}
                    onChange={(e) => handleInputChange("parcelType", e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800 text-slate-200">Select parcel type</option>
                    <option value="document" className="bg-slate-800 text-slate-200">Document</option>
                    <option value="package" className="bg-slate-800 text-slate-200">Package</option>
                    <option value="fragile" className="bg-slate-800 text-slate-200">Fragile</option>
                    <option value="electronics" className="bg-slate-800 text-slate-200">Electronics</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="weight" className="text-sm font-medium text-slate-300">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                  placeholder="0.0"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="length" className="text-sm font-medium text-slate-300">
                  Length (cm)
                </label>
                <input
                  id="length"
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) => handleInputChange("dimensions.length", e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="width" className="text-sm font-medium text-slate-300">
                  Width (cm)
                </label>
                <input
                  id="width"
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => handleInputChange("dimensions.width", e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="height" className="text-sm font-medium text-slate-300">
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) => handleInputChange("dimensions.height", e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-purple-600/10 rounded-xl blur opacity-30"></div>
          <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-purple-400" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="paymentType" className="text-sm font-medium text-slate-300">
                  Payment Type
                </label>
                <div className="relative">
                  <select
                    id="paymentType"
                    value={formData.paymentType}
                    onChange={(e) => handleInputChange("paymentType", e.target.value as "cod" | "prepaid")}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="prepaid" className="bg-slate-800 text-slate-200">Prepaid</option>
                    <option value="cod" className="bg-slate-800 text-slate-200">Cash on Delivery (COD)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              {formData.paymentType === "cod" && (
                <div className="space-y-2">
                  <label htmlFor="codAmount" className="text-sm font-medium text-slate-300">
                    COD Amount (₹)
                  </label>
                  <input
                    id="codAmount"
                    type="number"
                    step="0.01"
                    value={formData.codAmount}
                    onChange={(e) => handleInputChange("codAmount", e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-purple-500/20 to-blue-600/20 rounded-xl blur opacity-30"></div>
          <button
            type="submit"
            disabled={loading}
            className="relative w-full px-6 py-4 bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700/50 disabled:to-slate-600/50 text-white rounded-xl border border-blue-500/30 hover:border-blue-400/50 disabled:border-slate-600/30 transition-all duration-200 font-medium text-lg disabled:cursor-not-allowed backdrop-blur-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Booking Parcel...
              </div>
            ) : (
              "Book Parcel"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
