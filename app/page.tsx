"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, MapPin, Shield, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Footer from "@/components/Footer"
import CTA from "@/components/CTA"

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirect based on role
      switch (user.role) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "agent":
          router.push("/agent/parcels")
          break
        case "customer":
          router.push("/customer/book")
          break
      }
    }
  }, [user, router])

  if (user) {
    return null // Will redirect
  }

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CourierPro</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Features />
      {/* Call to Action Section */}
      <CTA />
      {/* Footer */}
      <Footer />
    </div>

  )
}
