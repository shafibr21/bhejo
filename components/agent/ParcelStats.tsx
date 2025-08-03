"use client";

import { Package, Route, MapPin, CheckCircle, AlertCircle } from "lucide-react";

interface ParcelStatsProps {
  parcels: any[];
}

export function ParcelStats({ parcels }: ParcelStatsProps) {
  const stats = [
    {
      label: "Total Assigned",
      value: parcels.length,
      icon: Package,
      color: "text-blue-400",
      bgColor: "bg-blue-900/30 border-blue-800/50",
    },
    {
      label: "In Transit",
      value: parcels.filter((p: any) => p.status === "in_transit").length,
      icon: Route,
      color: "text-green-400",
      bgColor: "bg-green-900/30 border-green-800/50",
    },
    {
      label: "Out for Delivery",
      value: parcels.filter((p: any) => p.status === "out_for_delivery").length,
      icon: MapPin,
      color: "text-orange-400",
      bgColor: "bg-orange-900/30 border-orange-800/50",
    },
    {
      label: "Delivered",
      value: parcels.filter((p: any) => p.status === "delivered").length,
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-900/30 border-emerald-800/50",
    },
    {
      label: "Failed",
      value: parcels.filter((p: any) => p.status === "failed").length,
      icon: AlertCircle,
      color: "text-red-400",
      bgColor: "bg-red-900/30 border-red-800/50",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-green-100 to-blue-200 bg-clip-text text-transparent">
          Parcel Statistics
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 to-transparent"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700/20 to-slate-600/20 rounded-lg blur opacity-20"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/70 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
