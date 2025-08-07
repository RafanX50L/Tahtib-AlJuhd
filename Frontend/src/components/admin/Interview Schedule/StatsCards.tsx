import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, XCircle, CheckCircle } from 'lucide-react';

interface Stats {
  today: number;
  pending: number;
  canceled: number;
  completed: number;
}

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <Card className="bg-gray-800 border-gray-700 hover:-translate-y-1 transition-transform">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium">Interviews Today</h3>
              <p className="text-white text-xl lg:text-2xl font-bold mt-1">{stats.today}</p>
            </div>
            <div className="p-3 bg-indigo-500 bg-opacity-20 rounded-full">
              <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700 hover:-translate-y-1 transition-transform">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium">Pending Interviews</h3>
              <p className="text-white text-xl lg:text-2xl font-bold mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-full">
              <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700 hover:-translate-y-1 transition-transform">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium">Canceled Interviews</h3>
              <p className="text-white text-xl lg:text-2xl font-bold mt-1">{stats.canceled}</p>
            </div>
            <div className="p-3 bg-red-500 bg-opacity-20 rounded-full">
              <XCircle className="h-5 w-5 lg:h-6 lg:w-6 text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700 hover:-translate-y-1 transition-transform">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium">Completed Interviews</h3>
              <p className="text-white text-xl lg:text-2xl font-bold mt-1">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-500 bg-opacity-20 rounded-full">
              <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;