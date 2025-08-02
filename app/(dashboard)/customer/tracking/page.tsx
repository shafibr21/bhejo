"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Package, MapPin, Clock, CheckCircle, Truck, AlertCircle } from "lucide-react"
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/parcelStatus"

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [parcel, setParcel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setLoading(true)
    setError("")
    setParcel(null)

    try {
      const response = await fetch(`/api/parcels/track/${trackingNumber}`)

      if (response.ok) {
        const data = await response.json()
        setParcel(data)
      } else {
        setError("Parcel not found. Please check your tracking number.")
      }
    } catch (error) {
      setError("An error occurred while tracking your parcel.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "assigned":
      case "picked_up":
        return <Package className="h-4 w-4" />
      case "in_transit":
      case "out_for_delivery":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
      case "returned":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Track Your Parcel</h1>
        <p className="text-gray-600">Enter your tracking number to get real-time updates</p>
      </div>

      {/* Tracking Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Track Parcel
          </CardTitle>
          <CardDescription>Enter your tracking number to see the current status</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                placeholder="Enter tracking number (e.g., CP1234567890ABCD)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Tracking..." : "Track Parcel"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {parcel && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Parcel Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {(parcel as any).trackingNumber}
                </CardTitle>
                <Badge className={STATUS_COLORS[(parcel as any).status as keyof typeof STATUS_COLORS]}>
                  {STATUS_LABELS[(parcel as any).status as keyof typeof STATUS_LABELS]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Sender</h3>
                  <p className="text-sm">{(parcel as any).senderName}</p>
                  <p className="text-sm text-gray-500">{(parcel as any).senderPhone}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recipient</h3>
                  <p className="text-sm">{(parcel as any).recipientName}</p>
                  <p className="text-sm text-gray-500">{(parcel as any).recipientPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
              <CardDescription>Follow your parcel's journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(parcel as any).statusHistory?.map((status: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        {getStatusIcon(status.status)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{STATUS_LABELS[status.status as keyof typeof STATUS_LABELS]}</h4>
                        <span className="text-sm text-gray-500">{new Date(status.timestamp).toLocaleString()}</span>
                      </div>
                      {status.notes && <p className="text-sm text-gray-600 mt-1">{status.notes}</p>}
                      {status.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {status.location.address}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Location */}
          {(parcel as any).currentLocation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{(parcel as any).currentLocation.address}</p>
                <div className="mt-4 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map integration would go here</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
