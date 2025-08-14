import Sidebar from "../../components/trainer/Sidebar";
import Header from "../../components/trainer/Dashboard/Header";
import TrainerClients from "@/components/trainer/Clients/TrainerClients";

const TClientPage = () => {
  return (
    <div className="min-h-screen flex font-sans bg-[#121212] text-[#ffffff]">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-[280px] p-4 lg:p-8">
        <Header text="Clients" />
        <TrainerClients/>
      </main>
    </div>
  );
};

export default TClientPage;
