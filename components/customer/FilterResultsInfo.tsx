import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/constants/parcelStatus";

interface FilterResultsInfoProps {
  totalParcels: number;
  filteredCount: number;
  searchTerm: string;
  statusFilter: string;
}

export function FilterResultsInfo({
  totalParcels,
  filteredCount,
  searchTerm,
  statusFilter,
}: FilterResultsInfoProps) {
  const hasActiveFilters = searchTerm || statusFilter !== "all";

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Showing {filteredCount} of {totalParcels} parcels
      </p>
      {hasActiveFilters && (
        <div className="flex gap-2">
          {searchTerm && (
            <Badge variant="outline">Search: "{searchTerm}"</Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="outline">
              Status:{" "}
              {STATUS_LABELS[statusFilter as keyof typeof STATUS_LABELS]}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
