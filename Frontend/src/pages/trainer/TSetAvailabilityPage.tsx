import Sidebar from "../../components/trainer/Sidebar";
import Header from "../../components/trainer/Dashboard/Header";
import { SetAvailabilityPage } from "@/components/trainer/SetAvailability/SetAvailabilityPage";

const TSetAvailabilityPage = () => {
  return (
    <div className="min-h-screen flex font-sans bg-[#121212] text-[#ffffff]">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-[280px] p-4 lg:p-8">
        <Header />
        <SetAvailabilityPage/>
      </main>
    </div>
  );
};

export default TSetAvailabilityPage;