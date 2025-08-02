"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, MapPin, User, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BookParcelFormProps {
  onSuccess?: (parcel: any) => void
}

export function BookParcelForm({ onSuccess }: BookParcelFormProps) {
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    parcelType: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    paymentType: "prepaid" as "cod" | "prepaid",
    codAmount: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/parcels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          weight: Number.parseFloat(formData.weight),
          dimensions: {
            length: Number.parseFloat(formData.dimensions.length),
            width: Number.parseFloat(formData.dimensions.width),
            height: Number.parseFloat(formData.dimensions.height),
          },
          codAmount: formData.paymentType === "cod" ? Number.parseFloat(formData.codAmount) : 0,
        }),
      })

      if (response.ok) {
        const { parcel } = await response.json()
        toast({
          title: "Parcel Booked Successfully!",
          description: `Tracking Number: ${parcel.trackingNumber}`,
        })
        onSuccess?.(parcel)
        // Reset form
        setFormData({
          senderName: "",
          senderPhone: "",
          senderAddress: "",
          recipientName: "",
          recipientPhone: "",
          recipientAddress: "",
          parcelType: "",
          weight: "",
          dimensions: { length: "", width: "", height: "" },
          paymentType: "prepaid",
          codAmount: "",
        })
      } else {
        const { error } = await response.json()
        setError(error || "Failed to book parcel")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Book a Parcel
        </CardTitle>
        <CardDescription>Fill in the details to book your parcel for delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Sender Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Sender Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Full Name</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange("senderName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderPhone">Phone Number</Label>
                <Input
                  id="senderPhone"
                  type="tel"
                  value={formData.senderPhone}
                  onChange={(e) => handleInputChange("senderPhone", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderAddress">Pickup Address</Label>
              <Textarea
                id="senderAddress"
                value={formData.senderAddress}
                onChange={(e) => handleInputChange("senderAddress", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Recipient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Recipient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Full Name</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange("recipientName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientPhone">Phone Number</Label>
                <Input
                  id="recipientPhone"
                  type="tel"
                  value={formData.recipientPhone}
                  onChange={(e) => handleInputChange("recipientPhone", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Delivery Address</Label>
              <Textarea
                id="recipientAddress"
                value={formData.recipientAddress}
                onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Parcel Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Parcel Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parcelType">Parcel Type</Label>
                <Select value={formData.parcelType} onValueChange={(value) => handleInputChange("parcelType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parcel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                    <SelectItem value="fragile">Fragile</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) => handleInputChange("dimensions.length", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => handleInputChange("dimensions.width", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) => handleInputChange("dimensions.height", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value: "cod" | "prepaid") => handleInputChange("paymentType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prepaid">Prepaid</SelectItem>
                    <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.paymentType === "cod" && (
                <div className="space-y-2">
                  <Label htmlFor="codAmount">COD Amount (₹)</Label>
                  <Input
                    id="codAmount"
                    type="number"
                    step="0.01"
                    value={formData.codAmount}
                    onChange={(e) => handleInputChange("codAmount", e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Booking Parcel..." : "Book Parcel"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
