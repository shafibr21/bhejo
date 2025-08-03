"use client";

import { useEffect, useState } from "react";
import { Users, User, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");

  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (roleFilter !== "all") params.append("role", roleFilter);

      const response = await fetch(`/api/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-900/30 text-red-300 border border-red-800/50";
      case "agent":
        return "bg-blue-900/30 text-blue-300 border border-blue-800/50";
      case "customer":
        return "bg-green-900/30 text-green-300 border border-green-800/50";
      default:
        return "bg-slate-800/60 text-slate-200 border border-slate-700/50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 rounded-3xl p-4 md:p-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-400">Manage all users in the system</p>
        </div>

        {/* Filters */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                  Filters
                </h3>
                <Users className="h-5 w-5 text-blue-400" />
                <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              </div>
              <div className="flex gap-4">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-48 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                >
                  <option value="all" className="bg-slate-800 text-slate-100">
                    All Roles
                  </option>
                  <option value="admin" className="bg-slate-800 text-slate-100">
                    Admin
                  </option>
                  <option value="agent" className="bg-slate-800 text-slate-100">
                    Agent
                  </option>
                  <option
                    value="customer"
                    className="bg-slate-800 text-slate-100"
                  >
                    Customer
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {users.map((user: any) => (
            <div key={user._id} className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-xl blur opacity-30"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" />
                      {user.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Mail className="h-3 w-3 text-slate-400" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {user.phone}
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {user.address}
                      </div>
                    )}
                    <div className="text-xs text-slate-500 pt-2 border-t border-slate-700/50">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl">
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <Users className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                  No users found
                </h3>
                <p className="text-slate-400 text-center">
                  Try adjusting your filter criteria
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
