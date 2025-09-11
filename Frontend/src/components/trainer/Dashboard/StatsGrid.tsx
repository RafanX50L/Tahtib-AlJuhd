import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { TrainerService } from '@/services/implementation/trainerServices';

const StatsGrid = () => {
  const [stats, setStats] = useState<{
    activeClients: number;
    sessionsToday: number;
    totalRevenueThisMonth: number;
    contractsExpiringSoon: number;
  }>({ activeClients: 0, sessionsToday: 0, totalRevenueThisMonth: 0, contractsExpiringSoon: 0 });

  useEffect(() => {
    (async () => {
      try {
        const data = await TrainerService.getDashboardStats();
        setStats(data);
      } catch {
        // handled in service
      }
    })();
  }, []);

  const cards = [
    { value: stats.activeClients.toString(), label: 'Active Clients' },
    { value: stats.sessionsToday.toString(), label: 'Sessions Today' },
    { value: `₹${stats.totalRevenueThisMonth.toLocaleString()}`, label: 'Total Revenue (This Month)' },
    { value: stats.contractsExpiringSoon.toString(), label: 'Contracts Expiring Soon' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((stat) => (
        <Card
          key={stat.label}
          className="relative bg-[#1e1e1e] border-[#2c2c2c] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-lg transition-all"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366f1] to-[#818cf8]"></div>
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-[#ffffff]">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[#b0b0b0] text-sm">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;