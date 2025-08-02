"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportExportProps {
  parcels: any[];
  users: any[];
}

export function ReportExport({ parcels, users }: ReportExportProps) {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("7");
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const reportTypes = [
    { value: "parcels", label: "Parcel Report" },
    { value: "delivery", label: "Delivery Performance" },
    { value: "revenue", label: "Revenue Report" },
    { value: "agents", label: "Agent Performance" },
    { value: "customers", label: "Customer Report" },
  ];

  const dateRanges = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
    { value: "365", label: "Last year" },
    { value: "custom", label: "Custom range" },
  ];

  const generateReport = async () => {
    if (!reportType) {
      toast({
        title: "Please select a report type",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      const reportData = generateReportData();

      if (format === "csv") {
        downloadCSV(reportData);
      } else {
        downloadPDF(reportData);
      }

      toast({
        title: "Report Generated",
        description: `${
          reportTypes.find((r) => r.value === reportType)?.label
        } has been downloaded`,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(dateRange));

    const filteredParcels = parcels.filter((p) => {
      const parcelDate = new Date(p.createdAt);
      return parcelDate >= startDate && parcelDate <= endDate;
    });

    switch (reportType) {
      case "parcels":
        return filteredParcels.map((p) => ({
          "Tracking Number": p.trackingNumber,
          Sender: p.senderName,
          Recipient: p.recipientName,
          Status: p.status,
          "Created Date": new Date(p.createdAt).toLocaleDateString(),
          Amount: p.amount || 0,
        }));

      case "delivery":
        return filteredParcels.map((p) => ({
          "Tracking Number": p.trackingNumber,
          Status: p.status,
          Agent: p.agentName || "Unassigned",
          Created: new Date(p.createdAt).toLocaleDateString(),
          "Last Updated": new Date(p.updatedAt).toLocaleDateString(),
        }));

      case "revenue":
        return filteredParcels.map((p) => ({
          Date: new Date(p.createdAt).toLocaleDateString(),
          "Tracking Number": p.trackingNumber,
          Amount: p.amount || 0,
          Status: p.status,
          "Payment Method": p.paymentMethod || "COD",
        }));

      default:
        return filteredParcels;
    }
  };

  const downloadCSV = (data: any[]) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => `"${String(row[header]).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = (data: any[]) => {
    // This is a simplified version. In a real app, you'd use a library like jsPDF
    toast({
      title: "PDF Export",
      description:
        "PDF export feature would be implemented with a proper PDF library",
    });
  };

  const getReportStats = () => {
    const totalParcels = parcels.length;
    const deliveredParcels = parcels.filter(
      (p) => p.status === "delivered"
    ).length;
    const totalRevenue = parcels.reduce((sum, p) => sum + (p.amount || 0), 0);
    const avgDeliveryTime = "2.5 days"; // This would be calculated properly

    return { totalParcels, deliveredParcels, totalRevenue, avgDeliveryTime };
  };

  const stats = getReportStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Report Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {stats.totalParcels}
            </div>
            <div className="text-xs text-gray-600">Total Parcels</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {stats.deliveredParcels}
            </div>
            <div className="text-xs text-gray-600">Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              ${stats.totalRevenue}
            </div>
            <div className="text-xs text-gray-600">Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {stats.avgDeliveryTime}
            </div>
            <div className="text-xs text-gray-600">Avg Delivery</div>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={generateReport}
          disabled={!reportType || loading}
          className="w-full gap-2"
        >
          <Download className="h-4 w-4" />
          {loading ? "Generating..." : "Generate & Download Report"}
        </Button>

        {/* Preview */}
        {reportType && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Report Preview</h4>
            <p className="text-sm text-blue-700">
              {reportTypes.find((r) => r.value === reportType)?.label} for the{" "}
              {dateRanges
                .find((r) => r.value === dateRange)
                ?.label.toLowerCase()}{" "}
              in {format.toUpperCase()} format
            </p>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline">
                ~{generateReportData().length} records
              </Badge>
              <Badge variant="outline">{format.toUpperCase()}</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
