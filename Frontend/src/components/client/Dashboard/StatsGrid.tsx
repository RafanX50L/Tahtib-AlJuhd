import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaClock, FaBolt, FaCalendarCheck, FaDumbbell, FaArrowUp } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/services/implementation/api';

interface DashboardStats {
  workoutsCompleted: number;
  activeMinutes: number;
  caloriesBurned: number;
  currentStreak: number;
  weightProgress: {
    current: number;
    target: number;
    lost: number;
  };
  weeklyProgress: {
    completed: number;
    total: number;
  };
  upcomingSessions: number;
  planStatus: 'Active' | 'Inactive';
}

const fetchDashboardStats = async (userId: string): Promise<DashboardStats> => {
  const response = await api.get(`/client/dashboard/stats/${userId}`);
  return response.data.data; // ✅ not response.data
};


const StatsGrid = () => {
  const { user } = useSelector((s: RootState) => s.auth);

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats', user?._id],
    queryFn: () => fetchDashboardStats(user?._id as string),
    enabled: !!user?._id, // Only run if userId is available
    retry: 1,
    staleTime: 1000 * 60, // 1 min cache
  });
  console.log(stats);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="relative bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] animate-pulse">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
            <CardHeader className="flex justify-between items-center">
              <div className="h-4 bg-gray-600 rounded w-24"></div>
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-600 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return <p className="text-center text-red-500">Failed to load dashboard stats.</p>;
  }

  const statsData = [
    { 
      title: 'Workouts Completed', 
      value: stats.workoutsCompleted.toString(), 
      change: `+${stats.weeklyProgress.completed} this week`, 
      icon: FaDumbbell 
    },
    { 
      title: 'Active Minutes', 
      value: stats.activeMinutes.toString(), 
      change: `+${Math.floor(stats.activeMinutes / 7)} daily avg`, 
      icon: FaClock 
    },
    { 
      title: 'Calories Burned', 
      value: stats.caloriesBurned.toLocaleString(), 
      change: `+${Math.floor(stats.caloriesBurned / 7)} daily avg`, 
      icon: FaBolt 
    },
    { 
      title: 'Current Streak', 
      value: `${stats.currentStreak} days`, 
      change: stats.currentStreak > 0 ? 'Keep it up!' : 'Start your streak!', 
      icon: FaCalendarCheck 
    },
  ];



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-[fadeIn_0.6s_ease-out_0.1s_forwards]">
      {statsData.map((stat) => (
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