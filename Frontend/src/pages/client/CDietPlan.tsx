import Sidebar from "../../components/client/Sidebar";
import Header from "../../components/client/Dashboard/CDHeader";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import { FaUser } from "react-icons/fa";
import ProfilePage from "@/components/client/Profile/Profile";
import DietPlanPage from "@/components/client/DietPlan/test";

const CDietPlanPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    console.log("user in profile", user);
  });
  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main
        className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all ${styles.container}`}
      >
        <DietPlanPage />
        <CFooter />
      </main>
    </div>
  );
};

export default CDietPlanPage;
