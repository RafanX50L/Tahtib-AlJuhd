import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {  FaClock, FaBolt, FaCalendarCheck, FaArrowUp } from 'react-icons/fa';

// FaFireFlameCurved
const StatsGrid = () => {
  const stats = [
    { title: 'Workouts Completed', value: '24', change: '+5 from last week', icon: FaClock },
    { title: 'Active Minutes', value: '420', change: '+85 from last week', icon: FaClock },
    { title: 'Calories Burned', value: '3,450', change: '+720 from last week', icon: FaBolt },
    { title: 'Current Streak', value: '14 days', change: '3 days to new record', icon: FaCalendarCheck },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-[fadeIn_0.6s_ease-out_0.1s_forwards]">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="relative bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] hover:-translate-y-1 hover:shadow-lg hover:border-[#5D5FEF] transition-all"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-[#A0A7B8] text-sm uppercase">{stat.title}</CardTitle>
            <stat.icon className="text-[#5D5FEF]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-white to-[#7577F5] bg-clip-text text-transparent">{stat.value}</div>
            <div className="flex items-center gap-1 text-sm text-[#00D68F]">
              <FaArrowUp />
              {stat.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;