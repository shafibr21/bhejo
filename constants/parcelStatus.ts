export const PARCEL_STATUS = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  FAILED: "failed",
  RETURNED: "returned",
} as const

export const STATUS_LABELS = {
  pending: "Pending",
  assigned: "Assigned",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed: "Failed",
  returned: "Returned",
}

export const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  picked_up: "bg-purple-100 text-purple-800",
  in_transit: "bg-indigo-100 text-indigo-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
}
