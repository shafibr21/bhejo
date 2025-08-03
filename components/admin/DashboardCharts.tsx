import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface StatusChartData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  statusStats: Array<{ _id: string; count: number }>;
}

const COLORS = [
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#EF4444", // Red
  "#6B7280", // Gray
];

export function DashboardCharts({ statusStats }: DashboardChartsProps) {
  const statusChartData: StatusChartData[] = statusStats.map((stat) => ({
    name: stat._id,
    value: stat.count,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart Card */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur-sm opacity-25 animate-pulse"></div>
        <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-2xl">
          <div className="p-6 pb-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent mb-2">
              Parcel Status Distribution
            </h3>
            <p className="text-sm text-slate-400">
              Current status of all parcels
            </p>
          </div>
          <div className="p-6 pt-2">
            <div className="w-full aspect-square max-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="rgba(148, 163, 184, 0.2)"
                    strokeWidth={1}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-lg">
                            <p className="text-slate-300 text-sm font-medium">{`${
                              label || payload[0].name
                            }`}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-cyan-300 text-sm">
                                {`${entry.name || "Count"}: ${entry.value}`}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur-sm opacity-25 animate-pulse"></div>
        <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-2xl">
          <div className="p-6 pb-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-800 to-blue-900 bg-clip-text text-transparent mb-2">
              Status Overview
            </h3>
            <p className="text-sm text-slate-400">Parcel count by status</p>
          </div>
          <div className="p-6 pt-2">
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="min-h-[300px]"
            >
              <BarChart
                data={statusChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148, 163, 184, 0.1)"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  className="fill-current"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={`bar-cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
