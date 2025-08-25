import Sidebar from "@/components/client/Sidebar";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CTHeader from "@/components/client/Trainer/CTHeader";
import TrainersMain from "@/components/client/Trainer/CTMainPage";
import Header from "@/components/client/Header";

const CTrainerSession: React.FC = () => {
  return (
    <>
      <div className="bg-[#12151E] text-white min-h-screen font-sans">
        <Sidebar />
        <main
          className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all ${styles.container} `}
        >
          <Header
            title="Find Your Trainer"
            content="Connect with certified fitness professionals"
          />
          <TrainersMain />
        </main>
      </div>
    </>
  );
};
export default CTrainerSession;
