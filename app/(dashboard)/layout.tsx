"use client";

import type React from "react";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Package,
  LayoutDashboard,
  Users,
  MapPin,
  History,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDelay: "150ms"}}></div>
          <div className="absolute inset-2 w-12 h-12 border-4 border-blue-400/20 border-t-blue-400 rounded-full animate-spin" style={{animationDelay: "300ms"}}></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getNavItems = () => {
    switch (user.role) {
      case "admin":
        return [
          {
            href: "/admin/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          { href: "/admin/parcels", label: "Parcels", icon: Package },
          { href: "/admin/users", label: "Users", icon: Users },
        ];
      case "agent":
        return [
          { href: "/agent/parcels", label: "My Parcels", icon: Package },
        ];
      case "customer":
        return [
          { href: "/customer/book", label: "Book Parcel", icon: Package },
          { href: "/customer/tracking", label: "Track Parcel", icon: MapPin },
          { href: "/customer/history", label: "History", icon: History },
          { href: "/customer/qrcode", label: "QR Codes", icon: Package },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="relative min-h-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1000ms"}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: "500ms"}}></div>
      </div> 
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}
        style={{ top: 0 }}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
          <div className="flex items-center">
        <Package className="h-8 w-8 text-blue-400" />
        <span className="ml-2 text-xl font-bold text-white">
          CourierPro
        </span>
          </div>
          <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
        onClick={() => setSidebarOpen(false)}
          >
        <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-slate-400">Welcome back,</p>
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-xs text-slate-400 capitalize">{user.role}</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
          key={item.href}
          href={item.href}
          className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
          onClick={() => setSidebarOpen(false)}
            >
          <item.icon className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
          {item.label}
            </Link>
          ))}
        </nav>
          </div>

          <div className="p-4 border-t border-slate-700/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <div className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-2 md:p-5">{children}</main>
      </div>
    </div>
  );
}
