"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "In Transit",
      value: parcels.filter((p: any) => p.status === "in_transit").length,
      icon: Route,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Out for Delivery",
      value: parcels.filter((p: any) => p.status === "out_for_delivery").length,
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Delivered",
      value: parcels.filter((p: any) => p.status === "delivered").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Failed",
      value: parcels.filter((p: any) => p.status === "failed").length,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
