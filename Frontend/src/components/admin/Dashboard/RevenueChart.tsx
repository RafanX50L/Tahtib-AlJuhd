import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, LucideIcon } from "lucide-react";

const RevenueChart = () => {
  return (
    <Card className="bg-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Monthly Revenue</h3>
        <div className="flex items-center space-x-2">
         彼此: 6 months
          <Button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white">
            Last 6 Months
          </Button>
          <Button className="px-3 py-1 text-sm text-gray-400 hover:text-white" variant="ghost">
            Year
          </Button>
        </div>
      </div>
      <div className="relative h-60">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <line x1="40" y1="180" x2="380" y2="180" stroke="#4B5563" strokeWidth="1" />
          <line x1="40" y1="20" x2="40" y2="180" stroke="#4B5563" strokeWidth="1" />
          <text x="70" y="195" fill="#9CA3AF" fontSize="10" textAnchor="middle">Nov</text>
          <text x="125" y="195" fill="#9CA3AF" fontSize="10" textAnchor="middle">Dec</text>
          <text x="180" y="195" fill="#9CA3AF" fontSize="10" textAnchor="middle">Jan</text>
          <text x="235" y="195" fill="#9CA3AF" fontSize="10" textAnchor="middle">Feb</text>
          <text x="290" y="195" fill="#9CA3AF" fontSize="10" textAnchor="middle">Mar</text>
          <text x="345" y="195" fill="#9CA3AF" fontSize="10" textAnchor="middle">Apr</text>
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
          <path
            d="M70,120 L125,110 L180,95 L235,85 L290,70 L345,50"
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
          />
          <circle cx="70" cy="120" r="4" fill="#6366F1" />
          <circle cx="125" cy="110" r="4" fill="#6366F1" />
          <circle cx="180" cy="95" r="4" fill="#6366F1" />
          <circle cx="235" cy="85" r="4" fill="#6366F1" />
          <circle cx="290" cy="70" r="4" fill="#6366F1" />
          <circle cx="345" cy="50" r="4" fill="#6366F1" />
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
          <path
            d="M70,120 L125,110 L180,95 L235,85 L290,70 L345,50 L345,180 L70,180 Z"
            fill="url(#gradient)"
          />
        </svg>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm">
        <div>
          <span className="text-gray-400">Total Revenue:</span>
          <span className="text-white font-medium ml-2">$89,542</span>
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