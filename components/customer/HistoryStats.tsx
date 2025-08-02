"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"

interface HistoryStatsProps {
  stats: {
    total: number
    pending: number
    in_transit: number
    delivered: number
    failed: number
  }
}

export function HistoryStats({ stats }: HistoryStatsProps) {
  const statItems = [
    {
      label: "Total",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      color: "text-yellow-600",
    },
    {
      label: "In Transit",
      value: stats.in_transit,
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4 text-center">
            {item.icon && (
              <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
            )}
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-sm text-gray-600">{item.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
