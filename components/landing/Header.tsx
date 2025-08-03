"use client";

import { Package, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative backdrop-blur-sm bg-slate-800/30 border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-6">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-full blur animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <span className="ml-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              CourierPro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-4">
            <Link href="/login">
              <button className="px-4 lg:px-6 py-2 text-slate-300 hover:text-white transition-colors duration-200 font-medium">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 lg:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-slate-300 hover:text-white transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-slate-700/50 py-4">
            <div className="flex flex-col space-y-3">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 font-medium rounded-lg text-left">
                  Login
                </button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 text-center">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
