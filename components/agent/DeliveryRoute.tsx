"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Route as RouteIcon, Clock } from "lucide-react"

interface DeliveryRouteProps {
  parcels: any[]
}

export function DeliveryRoute({ parcels }: DeliveryRouteProps) {
  const [optimizedRoute, setOptimizedRoute] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [startLocation, setStartLocation] = useState("")

  // Filter parcels that are ready for delivery
  const deliveryParcels = parcels.filter(p => 
    p.status === "out_for_delivery" || p.status === "assigned" || p.status === "picked_up"
  )

  const optimizeRoute = async () => {
    if (!startLocation.trim()) {
      alert("Please enter your starting location")
      return
    }

    setLoading(true)
    try {
      // In a real implementation, you would call Google Maps API here
      // For now, we'll simulate an optimized route
      const simulatedRoute = [...deliveryParcels].sort((a, b) => 
        a.recipientAddress.localeCompare(b.recipientAddress)
      )
      
      setOptimizedRoute(simulatedRoute)
    } catch (error) {
      console.error("Error optimizing route:", error)
    } finally {
      setLoading(false)
    }
  }

  const openInGoogleMaps = () => {
    if (optimizedRoute.length === 0) return

    const addresses = [startLocation, ...optimizedRoute.map(p => p.recipientAddress)]
    const waypoints = addresses.slice(1, -1).join("|")
    const origin = encodeURIComponent(addresses[0])
    const destination = encodeURIComponent(addresses[addresses.length - 1])
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`
    
    window.open(url, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RouteIcon className="h-5 w-5" />
          Delivery Route Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter your starting location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={optimizeRoute} 
            disabled={loading || deliveryParcels.length === 0}
          >
            {loading ? "Optimizing..." : "Optimize Route"}
          </Button>
        </div>

        {deliveryParcels.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No parcels available for delivery
          </p>
        )}

        {optimizedRoute.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Optimized Route ({optimizedRoute.length} stops)</h4>
              <Button onClick={openInGoogleMaps} size="sm" className="gap-2">
                <Navigation className="h-4 w-4" />
                Open in Maps
              </Button>
            </div>
            
            <div className="space-y-2">
              {optimizedRoute.map((parcel, index) => (
                <div key={parcel._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{parcel.trackingNumber}</span>
                      <Badge variant="outline" className="text-xs">
                        {parcel.recipientName}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{parcel.recipientAddress}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Est. 15 min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
