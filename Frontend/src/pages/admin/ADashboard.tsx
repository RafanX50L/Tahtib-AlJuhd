import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "../../components/admin/Dashboard/StatsCard";
import TrainerApplications from "../../components/admin/Dashboard/TrainerApplication";
import RevenueChart from "../../components/admin/Dashboard/RevenueChart";
import RecentPayments from "../../components/admin/Dashboard/RecentPayments";
//

const ADashboard = () => {
  return (
    <AdminLayout title="Admin Dashboard">
      <StatsCard />
      <TrainerApplications />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
        <RevenueChart />
        <RecentPayments />
      </div>
    </AdminLayout>
  );
};

export default ADashboard;