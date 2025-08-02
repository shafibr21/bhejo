"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminDashboardStats } from "@/components/admin/AdminDashboardStats";
import { AgentAssignment } from "@/components/admin/AgentAssignment";
import { ReportExport } from "@/components/admin/ReportExport";
import { ParcelCard } from "@/components/parcels/ParcelCard";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Analytics {
  dailyBookings: number;
  totalParcels: number;
  failedDeliveries: number;
  totalCodAmount: number;
  totalRevenue: number;
  activeAgents: number;
  pendingAssignments: number;
  deliveredToday: number;
  avgDeliveryTime: number;
  statusStats: Array<{ _id: string; count: number }>;
  recentParcels: any[];
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchAnalytics(),
        fetchParcels(),
        fetchAgents(),
        fetchUsers(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/analytics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Add calculated fields for the dashboard
      const enhancedData = {
        ...data,
        totalRevenue: data.totalCodAmount || 0,
        activeAgents: 5, // This would come from the API
        pendingAssignments: 8, // This would come from the API
        deliveredToday: 12, // This would come from the API
        avgDeliveryTime: 2.5, // This would come from the API
      };
      setAnalytics(enhancedData);
    }
  };

  const fetchParcels = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/parcels", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setParcels(data.parcels || []);
    }
  };

  const fetchAgents = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/users?role=agent", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setAgents(data.users || []);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUsers(data.users || []);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>Error loading dashboard data</div>;
  }

  const statusChartData = analytics.statusStats.map((stat) => ({
    name: stat._id,
    value: stat.count,
  }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF7C7C",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your courier operations</p>
      </div>

      {/* Analytics Stats */}
      <AdminDashboardStats analytics={analytics} />

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Assignment */}
        <AgentAssignment
          parcels={parcels}
          agents={agents}
          onAssignmentUpdate={fetchData}
        />

        {/* Report Export */}
        <ReportExport parcels={parcels} users={users} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Parcel Status Distribution</CardTitle>
            <CardDescription>Current status of all parcels</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription>Parcel count by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Parcels */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Parcels</CardTitle>
          <CardDescription>Latest parcel bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {analytics.recentParcels.map((parcel) => (
              <ParcelCard
                key={parcel._id}
                parcel={parcel}
                showActions={false}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
