// CTProfile.tsx
import { useRef } from "react";
import Sidebar from "../../components/client/Sidebar";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import TrainerProfile from "@/components/client/Trainer/CTProfile";
import Header, { SidebarRef } from "@/components/client/Header";

const CTProfilePage = () => {
  const sidebarRef = useRef<SidebarRef>(null);

  const handleMenuToggle = () => {
    sidebarRef.current?.toggleSidebar();
  };

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar ref={sidebarRef} />
      <main
        className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all duration-300 ${styles.container}`}
      >
        <Header
          title="Trainer Profile"
          content="Manage your trainer profile and settings"
          onMenuToggle={handleMenuToggle}
        />
        <TrainerProfile />
        <CFooter />
      </main>
    </div>
  );
};

export default CTProfilePage;