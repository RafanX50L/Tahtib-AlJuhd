import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, RefreshCw,  TrendingUp, Calendar } from "lucide-react";
import { AdminService } from "@/services/implementation/adminServices";

const RevenueChart = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [monthsBack, setMonthsBack] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await AdminService.getDashboardRevenue(monthsBack);
        setLabels(res.labels);
        setValues(res.revenue);
      } catch {
        // handled by interceptor/toast elsewhere
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [monthsBack]);

  // Dynamic calculations for responsive layout
  const maxValue = Math.max(1, ...values);
  const chartWidth = 400;
  const chartHeight = 200;
  const padding = { left: 60, right: 20, top: 20, bottom: 40 };
  const chartArea = {
    width: chartWidth - padding.left - padding.right,
    height: chartHeight - padding.top - padding.bottom
  };

  // Calculate responsive point positions
  const points = values.map((v, i) => {
    const x = padding.left + (i * chartArea.width) / Math.max(1, values.length - 1);
    const y = padding.top + chartArea.height - (chartArea.height * v) / maxValue;
    return { x, y, value: v, label: labels[i] };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  // Format value for display
  const formatValue = (value: number) => {
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  // Generate Y-axis labels dynamically
  const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
    const value = (maxValue * (4 - i)) / 4;
    return {
      y: padding.top + (chartArea.height * i) / 4,
      value: Math.round(value),
      label: formatValue(Math.round(value))
    };
  });

  const totalRevenue = values.reduce((a, b) => a + b, 0);
  const averageGrowth = values.length > 1 
    ? ((values[values.length - 1] - values[0]) / values[0] * 100) 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl overflow-hidden">
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Monthly Revenue</h3>
              <p className="text-sm text-gray-400">Track your business growth over time</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row sm:items-center">
            {/* Period Selector */}
            <div className="flex bg-gray-700/50 rounded-lg p-1 w-full sm:w-auto">
              <Button
                size="sm"
                variant={monthsBack === 6 ? "default" : "ghost"}
                className={`flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm transition-all ${
                  monthsBack === 6 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
                onClick={() => setMonthsBack(6)}
                disabled={isLoading}
              >
                6M
              </Button>
              <Button
                size="sm"
                variant={monthsBack === 12 ? "default" : "ghost"}
                className={`flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm transition-all ${
                  monthsBack === 12 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
                onClick={() => setMonthsBack(12)}
                disabled={isLoading}
              >
                1Y
              </Button>
            </div>

            
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-4 sm:p-6">
        <div className="relative">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-gray-300">Loading chart data...</span>
              </div>
            </div>
          )}

          {/* Chart Container */}
          <div className="relative h-64 sm:h-72 lg:h-80 w-full">
            <svg 
              className="w-full h-full" 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid Lines */}
              {yAxisLabels.map((label, i) => (
                <line
                  key={i}
                  x1={padding.left}
                  y1={label.y}
                  x2={chartWidth - padding.right}
                  y2={label.y}
                  stroke="#374151"
                  strokeWidth="1"
                  strokeDasharray={i === yAxisLabels.length - 1 ? "none" : "2,2"}
                  opacity="0.5"
                />
              ))}

              {/* Y-axis */}
              <line 
                x1={padding.left} 
                y1={padding.top} 
                x2={padding.left} 
                y2={chartHeight - padding.bottom} 
                stroke="#4B5563" 
                strokeWidth="2" 
              />

              {/* X-axis */}
              <line 
                x1={padding.left} 
                y1={chartHeight - padding.bottom} 
                x2={chartWidth - padding.right} 
                y2={chartHeight - padding.bottom} 
                stroke="#4B5563" 
                strokeWidth="2" 
              />

              {/* Y-axis Labels */}
              {yAxisLabels.map((label, i) => (
                <text
                  key={i}
                  x={padding.left - 10}
                  y={label.y + 4}
                  fill="#9CA3AF"
                  fontSize="11"
                  textAnchor="end"
                  className="select-none"
                >
                  {label.label}
                </text>
              ))}

              {/* X-axis Labels */}
              {points.map((point, i) => (
                <text
                  key={i}
                  x={point.x}
                  y={chartHeight - padding.bottom + 20}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="middle"
                  className="select-none"
                >
                  {point.label}
                </text>
              ))}

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Area Fill */}
              {points.length > 0 && (
                <path
                  d={`${pathD} L${points[points.length - 1]?.x},${chartHeight - padding.bottom} L${points[0]?.x},${chartHeight - padding.bottom} Z`}
                  fill="url(#chartGradient)"
                />
              )}

              {/* Main Line */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="#6366F1" 
                strokeWidth="3"
                filter="url(#glow)"
                className="drop-shadow-lg"
              />

              {/* Data Points */}
              {points.map((point, i) => (
                <g key={i}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={hoveredPoint === i ? "6" : "4"}
                    fill="#6366F1"
                    stroke="#1F2937"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200 hover:r-6"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  
                  {/* Tooltip */}
                  {hoveredPoint === i && (
                    <g>
                      <rect
                        x={point.x - 35}
                        y={point.y - 35}
                        width="70"
                        height="25"
                        rx="4"
                        fill="#1F2937"
                        stroke="#374151"
                        strokeWidth="1"
                      />
                      <text
                        x={point.x}
                        y={point.y - 20}
                        fill="white"
                        fontSize="11"
                        textAnchor="middle"
                        className="font-medium"
                      >
                        ₹{point.value.toLocaleString()}
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Total Revenue</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Growth Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <p className={`text-xl sm:text-2xl font-bold ${averageGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {averageGrowth >= 0 ? '+' : ''}{averageGrowth.toFixed(1)}%
              </p>
              <ArrowUp className={`w-4 h-4 ${averageGrowth >= 0 ? 'text-green-400' : 'text-red-400 rotate-180'}`} />
            </div>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Average</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">
              ₹{values.length > 0 ? Math.round(totalRevenue / values.length).toLocaleString() : '0'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RevenueChart;
