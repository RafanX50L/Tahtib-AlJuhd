import Sidebar from "../../components/client/Sidebar";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import TrainerPage from "@/components/client/Trainer/CATrainerDetails";
import Header from "@/components/client/Header";

const CATrainerDetailsPage = () => {
  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main
        className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all ${styles.container}`}
      >
        <Header
          title="Profile Settings"
          content="Manage your personal information"
        />
        <TrainerPage />
        <CFooter />
      </main>
    </div>
  );
};

export default CATrainerDetailsPage;
