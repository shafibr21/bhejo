import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";

export interface Analytics {
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

export interface AdminDashboardData {
  analytics: Analytics | null;
  parcels: any[];
  agents: any[];
  users: any[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useAdminDashboard(): AdminDashboardData {
  const { socket } = useSocket();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchData = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchData();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      const handleParcelUpdate = (data: any) => {
        // Refresh analytics when a parcel is created/updated
        fetchAnalytics();
        fetchParcels();
      };

      const handleUserUpdate = (data: any) => {
        fetchUsers();
        fetchAgents();
      };

      socket.on("parcel-update", handleParcelUpdate);
      socket.on("parcel-status-updated", handleParcelUpdate);
      socket.on("admin-parcel-update", handleParcelUpdate); // Admin-specific updates
      socket.on("user-update", handleUserUpdate);

      return () => {
        socket.off("parcel-update", handleParcelUpdate);
        socket.off("parcel-status-updated", handleParcelUpdate);
        socket.off("admin-parcel-update", handleParcelUpdate);
        socket.off("user-update", handleUserUpdate);
      };
    }
  }, [socket]);

  return {
    analytics,
    parcels,
    agents,
    users,
    loading,
    refetch: fetchData,
  };
}
