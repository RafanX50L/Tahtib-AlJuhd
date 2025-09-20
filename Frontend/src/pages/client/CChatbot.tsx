// CChatbot.tsx
import { useRef } from "react";
import Sidebar from "../../components/client/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import ChatHistory from "@/components/client/chatBot/ChatHistory";
import Header, { SidebarRef } from "@/components/client/Header";

const CChatBotPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
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
          title="Chat Bot"
          content="Get instant help and guidance from our AI assistant"
          onMenuToggle={handleMenuToggle}
        />
        <ChatHistory clientId={user?._id as string} />
        <CFooter />
      </main>
    </div>
  );
};

export default CChatBotPage;