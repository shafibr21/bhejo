"use client";

import { Package } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative backdrop-blur-sm bg-slate-800/30 border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-full blur animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              CourierPro
            </span>
          </div>
          <div className="flex space-x-4">
            <Link href="/login">
              <button className="px-6 py-2 text-slate-300 hover:text-white transition-colors duration-200 font-medium">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
