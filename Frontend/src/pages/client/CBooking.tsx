// CProfile.tsx
import { useRef } from "react";
import Sidebar from "../../components/client/Sidebar";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import Header, { SidebarRef } from "@/components/client/Header";
import CBooking from "@/components/client/BookSessions/CBooking";

const CBookingPage = () => {
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
          title="Book Your Training Session"
          content="Choose your preferred time slot and get ready for an amazing workout experience"
          onMenuToggle={handleMenuToggle}
        />
        <div className="space-y-8">
          <CBooking/>
        </div>
        <CFooter />
      </main>
    </div>
  );
};

export default CBookingPage;