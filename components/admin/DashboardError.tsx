import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardError() {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex items-center gap-2 p-6">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <p className="text-red-800">Error loading dashboard data</p>
      </CardContent>
    </Card>
  );
}
