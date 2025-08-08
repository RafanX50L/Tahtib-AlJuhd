import Sidebar from "@/components/client/Sidebar";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CTHeader from "@/components/client/Trainer/CTHeader";
import TrainersMain from "@/components/client/Trainer/CTMainPage";

const CTrainerSession: React.FC = () => {
  return (
    <>
      <div className="bg-[#12151E] text-white min-h-screen font-sans">
        <Sidebar />
        <main
          className={`lg:ml-[280px] justify-items-center pt-[70px] lg:pt-0 p-4 lg:p-8 transition-all  ${styles.container}`}
        >
          <CTHeader />
          <TrainersMain />
        </main>
      </div>
    </>
  );
};
export default CTrainerSession;



