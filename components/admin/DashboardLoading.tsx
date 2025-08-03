import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>
  );
}
