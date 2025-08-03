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
          <div 
            key={index} 
            className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} transition-all duration-300`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm font-medium text-white/70">{stat.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${isIncrease ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <TrendIcon className={`h-3 w-3 ${isIncrease ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <span className={`text-sm font-medium ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
              <span className="text-sm text-white/50">from last week</span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 w-full bg-white/10 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${stat.bgColor.replace('/20', '/60').replace('/30', '/60')} h-2 rounded-full transition-all duration-1000`} 
                style={{width: `${60 + (index * 5)}%`}}
              ></div>
            </div>
            
            {/* Decorative gradient line */}
            <div className={`mt-3 w-12 h-0.5 bg-gradient-to-r ${stat.bgColor.replace('/20', '').replace('/30', '')} rounded-full`}></div>
          </div>
        )
      })}
    </div>
  )
}
