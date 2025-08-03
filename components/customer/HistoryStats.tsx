"use client";

import { Package, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

interface HistoryStatsProps {
  stats: {
    total: number;
    pending: number;
    in_transit: number;
    delivered: number;
    failed: number;
  };
}

export function HistoryStats({ stats }: HistoryStatsProps) {
  const statItems = [
    {
      label: "Total",
      value: stats.total,
      icon: Package,
      color: "text-blue-400",
      bgColor: "bg-blue-900/30",
      borderColor: "border-blue-800/50",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/30",
      borderColor: "border-yellow-800/50",
    },
    {
      label: "In Transit",
      value: stats.in_transit,
      icon: TrendingUp,
      color: "text-cyan-400",
      bgColor: "bg-cyan-900/30",
      borderColor: "border-cyan-800/50",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-900/30",
      borderColor: "border-green-800/50",
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-900/30",
      borderColor: "border-red-800/50",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-green-100 to-blue-200 bg-clip-text text-transparent">
          Quick Stats
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 to-transparent"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`relative group cursor-pointer transition-all duration-200 hover:scale-105`}
          >
            <div
              className={`absolute -inset-0.5 ${item.bgColor} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity`}
            ></div>
            <div
              className={`relative ${item.bgColor} backdrop-blur-sm border ${item.borderColor} rounded-xl p-4 text-center hover:bg-opacity-50 transition-all duration-200`}
            >
              <div className="flex justify-center mb-3">
                <div
                  className={`p-2 ${item.bgColor} rounded-lg border ${item.borderColor}`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
              </div>
              <div className={`text-2xl font-bold ${item.color} mb-1`}>
                {item.value}
              </div>
              <div className="text-sm text-slate-400">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
