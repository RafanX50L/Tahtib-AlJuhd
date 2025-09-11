import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, User, DollarSign, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { AdminService } from "@/services/implementation/adminServices";
import { Link } from "react-router-dom";

interface Stat {
  title: string;
  value: string;
  icon: string;
  trend: "up" | "down";
  trendValue: string;
  color: string;
}

const StatsCard = () => {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const s = await AdminService.getDashboardStats();
        const mapped: Stat[] = [
          { title: "Total Trainers", value: s.totalTrainers.toString(), icon: "Users", trend: "up", trendValue: "", color: "indigo" },
          { title: "Total Clients", value: s.totalClients.toString(), icon: "User", trend: "up", trendValue: "", color: "green" },
          { title: "Monthly Revenue", value: `₹${s.monthlyRevenue.toLocaleString()}` , icon: "DollarSign", trend: "up", trendValue: "", color: "blue" },
          { title: "Pending Trainer Approvals", value: s.pendingTrainerApprovals.toString(), icon: "Clock", trend: s.pendingTrainerApprovals > 0 ? "down" : "up", trendValue: "", color: "yellow" },
        ];
        setStats(mapped);
      } catch {
        // toast handled upstream if needed
      }
    })();
  }, []);

  const pendingCount = useMemo(() => {
    const item = stats.find(s => s.title === 'Pending Trainer Approvals');
    return item ? parseInt(item.value || '0', 10) : 0;
  }, [stats]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 ">
      {stats.map((stat, index) => {
        const content = (
        <Card key={index} className="bg-gray-800 p-6 hover:-translate-y-1 border-none transition-transform">
          <div className="flex items-center justify-between border-none">
            <div>
              <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
              <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 bg-${stat.color}-500 bg-opacity-20 rounded-full`}>
              {stat.icon === "Users" && <Users className={`w-6 h-6 text-${stat.color}-400`} />}
              {stat.icon === "User" && <User className={`w-6 h-6 text-${stat.color}-400`} />}
              {stat.icon === "DollarSign" && <DollarSign className={`w-6 h-6 text-${stat.color}-400`} />}
              {stat.icon === "Clock" && <Clock className={`w-6 h-6 text-${stat.color}-400`} />}
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center">
              {stat.trend === "up" ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {stat.trendValue}
            </span>
            <span className="text-gray-400 ml-2">
              {stat.trend === "up" ? "From last month" : "New today"}
            </span>
          </div>
        </Card>);
        if (stat.title === 'Pending Trainer Approvals' && pendingCount > 0) {
          return (
            <Link to="/admin/trainer-management" key={index} className="block">{content}</Link>
          );
        }
        return content;
      })}
    </div>
  );
};

export default StatsCard;