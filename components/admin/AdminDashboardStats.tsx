"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Truck,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface AdminDashboardStatsProps {
  analytics: {
    dailyBookings: number
    totalParcels: number
    failedDeliveries: number
    totalRevenue: number
    activeAgents: number
    pendingAssignments: number
    deliveredToday: number
    avgDeliveryTime: number
  }
}

export function AdminDashboardStats({ analytics }: AdminDashboardStatsProps) {
  const stats = [
    {
      title: "Daily Bookings",
      value: analytics.dailyBookings,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Total Parcels",
      value: analytics.totalParcels,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+5%",
      changeType: "increase"
    },
    {
      title: "Failed Deliveries",
      value: analytics.failedDeliveries,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "-3%",
      changeType: "decrease"
    },
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+18%",
      changeType: "increase"
    },
    {
      title: "Active Agents",
      value: analytics.activeAgents,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+2",
      changeType: "increase"
    },
    {
      title: "Pending Assignments",
      value: analytics.pendingAssignments,
      icon: Truck,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "-5",
      changeType: "decrease"
    },
    {
      title: "Delivered Today",
      value: analytics.deliveredToday,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "Avg Delivery Time",
      value: `${analytics.avgDeliveryTime}h`,
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "-0.5h",
      changeType: "decrease"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const isIncrease = stat.changeType === "increase"
        const TrendIcon = isIncrease ? TrendingUp : TrendingDown
        
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <TrendIcon className={`h-3 w-3 ${isIncrease ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-xs ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500">from last week</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
