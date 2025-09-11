import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";
import { AdminService } from "@/services/implementation/adminServices";

const RevenueChart = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [monthsBack, setMonthsBack] = useState(6);

  useEffect(() => {
    (async () => {
      try {
        const res = await AdminService.getDashboardRevenue(monthsBack);
        setLabels(res.labels);
        setValues(res.revenue);
      } catch {
        // handled by interceptor/toast elsewhere
      }
    })();
  }, [monthsBack]);

  const maxValue = Math.max(1, ...values);
  const points = values.map((v, i) => {
    const x = 70 + i * 55;
    const y = 180 - (160 * v) / maxValue;
    return { x, y };
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <Card className="bg-gray-800 p-6 border-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Monthly Revenue</h3>
        <div className="flex items-center space-x-2">
          <Button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setMonthsBack(6)}>Last 6 Months</Button>
          <Button className="px-3 py-1 text-sm text-gray-400 hover:text-white" variant="ghost" onClick={() => setMonthsBack(12)}>Year</Button>
        </div>
      </div>
      <div className="relative h-60">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <line x1="40" y1="180" x2="380" y2="180" stroke="#4B5563" strokeWidth="1" />
          <line x1="40" y1="20" x2="40" y2="180" stroke="#4B5563" strokeWidth="1" />
          {labels.map((l, i) => (
            <text key={l + i} x={`${70 + i * 55}`} y="195" fill="#9CA3AF" fontSize="10" textAnchor="middle">{l}</text>
          ))}
          <text x="35" y="180" fill="#9CA3AF" fontSize="10" textAnchor="end">0</text>
          <text x="35" y="140" fill="#9CA3AF" fontSize="10" textAnchor="end">5k</text>
          <text x="35" y="100" fill="#9CA3AF" fontSize="10" textAnchor="end">10k</text>
          <text x="35" y="60" fill="#9CA3AF" fontSize="10" textAnchor="end">15k</text>
          <text x="35" y="20" fill="#9CA3AF" fontSize="10" textAnchor="end">20k</text>
          <line
            x1="40"
            y1="140"
            x2="380"
            y2="140"
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <line
            x1="40"
            y1="100"
            x2="380"
            y2="100"
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <line
            x1="40"
            y1="60"
            x2="380"
            y2="60"
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <line
            x1="40"
            y1="20"
            x2="380"
            y2="20"
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <path d={pathD} fill="none" stroke="#6366F1" strokeWidth="3" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#6366F1" />
          ))}
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
          <path d={`${pathD} L${points.at(-1)?.x || 345},180 L70,180 Z`} fill="url(#gradient)" />
        </svg>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm">
        <div>
          <span className="text-gray-400">Total Revenue:</span>
          <span className="text-white font-medium ml-2">₹{values.reduce((a, b) => a + b, 0).toLocaleString()}</span>
        </div>
        <div>
          <span className="text-green-400 flex items-center">
            <ArrowUp className="w-4 h-4 mr-1" />
            18.2% from last period
          </span>
        </div>
      </div>
    </Card>
  );
};

export default RevenueChart;