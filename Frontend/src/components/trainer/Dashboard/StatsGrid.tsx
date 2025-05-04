import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatsGrid = () => {
  const stats = [
    { value: '24', label: 'Active Clients' },
    { value: '8', label: 'Sessions Today' },
    { value: '$5,230', label: 'Total Revenue' },
    { value: '$320', label: 'Pending Payments' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
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