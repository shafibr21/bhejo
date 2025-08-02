"use client"

import { BookParcelForm } from "@/components/forms/BookParcelForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useState } from "react"

export default function BookParcel() {
  const [bookedParcel, setBookedParcel] = useState(null)

  const handleBookingSuccess = (parcel: any) => {
    setBookedParcel(parcel)
  }

  if (bookedParcel) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Parcel Booked Successfully!</CardTitle>
            <CardDescription>Your parcel has been registered for pickup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Booking Details:</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Tracking Number:</strong> {(bookedParcel as any).trackingNumber}
                </p>
                <p>
                  <strong>Sender:</strong> {(bookedParcel as any).senderName}
                </p>
                <p>
                  <strong>Recipient:</strong> {(bookedParcel as any).recipientName}
                </p>
                <p>
                  <strong>Status:</strong> Pending Pickup
                </p>
              </div>
            </div>
            <div className="text-center">
              <button onClick={() => setBookedParcel(null)} className="text-blue-600 hover:underline">
                Book Another Parcel
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book a Parcel</h1>
        <p className="text-gray-600">Schedule a pickup for your parcel delivery</p>
      </div>

      <BookParcelForm onSuccess={handleBookingSuccess} />
    </div>
  )
}
