import Sidebar from "../../components/client/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import ChatHistory from "@/components/client/chatBot/ChatHistory";

const CChatBotPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main
        className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all ${styles.container}`}
      >
        <ChatHistory clientId={user?._id as string} />
        <CFooter />
      </main>
    </div>
  );
};

export default CChatBotPage;