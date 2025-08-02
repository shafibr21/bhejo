import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Clock, MapPin, Package, Shield, Truck, Users } from 'lucide-react'

const Features = () => {
  return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CourierPro?</h2>
            <p className="text-lg text-gray-600">Everything you need to manage your courier operations efficiently</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>Track your parcels in real-time with GPS integration and live updates</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Optimized Routes</CardTitle>
                <CardDescription>AI-powered route optimization for faster deliveries and reduced costs</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>End-to-end security with QR codes and digital signatures</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>Round-the-clock customer support and automated notifications</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Multi-role Access</CardTitle>
                <CardDescription>Separate dashboards for customers, agents, and administrators</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Package className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Easy Booking</CardTitle>
                <CardDescription>Simple parcel booking with COD and prepaid options</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
  )
}

export default Features