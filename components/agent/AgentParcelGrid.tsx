"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ParcelCard } from "@/components/parcels/ParcelCard";
import { Package } from "lucide-react";

interface AgentParcelGridProps {
  parcels: any[];
  onUpdateStatus: (parcel: any) => void;
}

export function AgentParcelGrid({
  parcels,
  onUpdateStatus,
}: AgentParcelGridProps) {
  if (parcels.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">
            No parcels assigned
          </h3>
          <p className="text-gray-500">
            You don't have any parcels assigned yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {parcels.map((parcel: any) => (
        <ParcelCard
          key={parcel._id}
          parcel={parcel}
          onUpdateStatus={onUpdateStatus}
          showActions={true}
        />
      ))}
    </>
  );
}
