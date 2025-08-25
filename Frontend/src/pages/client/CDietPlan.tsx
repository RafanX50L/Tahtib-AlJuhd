import Sidebar from "../../components/client/Sidebar";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import DietPlanPage from "@/components/client/DietPlan/DietPlan";
import Header from "@/components/client/Header";

const CDietPlanPage = () => {
  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans overflow-hidden scrollbar-none">
      <Sidebar />
      <main
        className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all ${styles.container}`}
      >
        <Header
          title="Your Diet Plan"
          content="Personalized vegetarian meal plan designed for muscle building and
              healthy weight gain"
        />
        <DietPlanPage />
        <CFooter />
      </main>
    </div>
  );
};

export default CDietPlanPage;
