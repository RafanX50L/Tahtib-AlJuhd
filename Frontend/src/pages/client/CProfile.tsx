import Sidebar from "../../components/client/Sidebar";
import Header from "../../components/client/Dashboard/CDHeader";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import { FaUser } from "react-icons/fa";
import ProfilePage from "@/components/client/Profile/Profile";

const CProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main
        className={`lg:ml-[280px]  pt-[70px] lg:pt-0 p-4 lg:p-8 transition-all p-32 ${styles.container}`}
      >
        {/* Header */}
        <div className="flex  justify-between items-center mb-10 fixed lg:static top-0 left-0 right-0 bg-[#12151E] p-4 lg:p-0 border-b border-[#2A3042] lg:border-none z-10 h-[70px] lg:h-auto shadow-lg lg:shadow-none">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-white to-[#A0A7B8] bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-[#A0A7B8] text-sm md:text-base">
              Manage your personal information and preferences
            </p>
          </div>
          {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5D5FEF] to-[#FF4757] border-2 border-[#2A3042] flex items-center justify-center cursor-pointer hover:scale-110 hover:shadow-lg transition-all">
            <FaUser className="text-white" />
          </div> */}
        </div>

        <ProfilePage />

        <CFooter />
      </main>
    </div>
  );
};

export default CProfile;
