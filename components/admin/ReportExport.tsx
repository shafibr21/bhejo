"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, FileText, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// No need for module declaration, just use autoTable directly

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
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available for the selected criteria",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text(
        `${reportTypes.find((r) => r.value === reportType)?.label || "Report"}`,
        14,
        20
      );

      // Add date range
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(
        `Date Range: ${dateRanges.find((r) => r.value === dateRange)?.label}`,
        14,
        36
      );

      const headers = Object.keys(data[0]);
      const rows = data.map((row) =>
        headers.map((header) => String(row[header] || ""))
      );

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 45,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 45 },
      });

      const filename = `${reportType}_report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
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
    <div >
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur-sm opacity-25 animate-pulse"></div>

          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="p-2 sm:p-2 pb-0">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent mb-2 flex items-center gap-2 mt-2 ml-2">
                <FileText className="h-6 w-6 text-blue-400" />
                Report Export
              </h2>
            </div>

            {/* Content */}
            <div className="p-2 sm:p-8 pt-2 space-y-2">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-gradient-to-r from-slate-800/30 to-slate-700/30 border border-slate-700/50 rounded-xl">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {stats.totalParcels}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Total Parcels
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    {stats.deliveredParcels}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                    ${stats.totalRevenue}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                    {stats.avgDeliveryTime}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Avg Delivery
                  </div>
                </div>
              </div>

              {/* Report Configuration */}
              <div className="grid grid-cols-1 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-300">
                    Report Type
                  </label>
                  <div className=" relative">
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white hover:border-slate-600/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {reportTypes.map((type) => (
                          <SelectItem
                            key={type.value}
                            value={type.value}
                            className="hover:bg-slate-700 focus:bg-slate-700"
                          >
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-300">
                    Date Range
                  </label>
                  <div className="relative">
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white hover:border-slate-600/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {dateRanges.map((range) => (
                          <SelectItem
                            key={range.value}
                            value={range.value}
                            className="hover:bg-slate-700 focus:bg-slate-700"
                          >
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-300">
                    Format
                  </label>
                  <div className="relative">
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white hover:border-slate-600/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem
                          value="csv"
                          className="hover:bg-slate-700 focus:bg-slate-700"
                        >
                          CSV
                        </SelectItem>
                        <SelectItem
                          value="pdf"
                          className="hover:bg-slate-700 focus:bg-slate-700"
                        >
                          PDF
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>

              <button
                onClick={generateReport}
                disabled={!reportType || loading}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <div className="relative flex items-center justify-center gap-3">
                  <Download className="h-5 w-5" />
                  {loading ? (
                    <>
                      Generating...
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </>
                  ) : (
                    "Generate & Download Report"
                  )}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </div>
              </button>

              {/* Preview */}
              {reportType && (
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur"></div>
                  <div className="relative p-6 bg-gradient-to-r from-green-950/30 to-emerald-950/30 border border-green-800/30 rounded-xl">
                    <h4 className="font-semibold text-green-300 mb-2">
                      Report Preview
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">
                      {reportTypes.find((r) => r.value === reportType)?.label}{" "}
                      for the{" "}
                      {dateRanges
                        .find((r) => r.value === dateRange)
                        ?.label.toLowerCase()}{" "}
                      in {format.toUpperCase()} format
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800/50 text-slate-300 border border-slate-700/50">
                        ~{parcels.length} records
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/50">
                        {format.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
