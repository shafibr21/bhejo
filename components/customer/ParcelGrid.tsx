import { Card, CardContent } from "@/components/ui/card"
import { ParcelCard } from "@/components/parcels/ParcelCard"
import { History, Search } from "lucide-react"

interface ParcelGridProps {
  filteredParcels: any[]
  totalParcels: number
}

export function ParcelGrid({ filteredParcels, totalParcels }: ParcelGridProps) {
  // No parcels at all
  if (totalParcels === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <History className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No bookings found</h3>
          <p className="text-gray-500">You haven't booked any parcels yet</p>
        </CardContent>
      </Card>
    )
  }

  // Has parcels but filtered results are empty
  if (filteredParcels.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No parcels match your filters</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </CardContent>
      </Card>
    )
  }

  // Show filtered parcels
  return (
    <>
      {filteredParcels.map((parcel: any) => (
        <ParcelCard key={parcel._id} parcel={parcel} showActions={false} />
      ))}
    </>
  )
}
