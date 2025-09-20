// CCTrainerPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLocation } from "react-router-dom";
import Sidebar from "@/components/client/Sidebar";
import { ClientService } from "@/services/implementation/clientServices";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import styles from "@/components/client/Personalization/styles/BasicDetails.module.css";
import CTChatSection from "@/components/client/Trainer/CTChat";
import SchedulingSection from "@/components/client/Trainer/SchedulingSession";
import Header, { SidebarRef } from "@/components/client/Header";

interface Contract {
  chatId: string;
  sessionsRemaining: number;
  trainerId: string;
  planName: string;
  trainerName?: string;
}

const CCurrentTrainerPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [contract, setContract] = useState<Contract | null>(null);
  const [trainerName, setTrainerName] = useState("");
  const [trainerPhoto, setTrainerPhoto] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sidebarRef = useRef<SidebarRef>(null);

  const handleMenuToggle = () => {
    sidebarRef.current?.toggleSidebar();
  };

  useEffect(() => {
    if (user?._id) {
      const trainername = queryParams.get("name");
      const trainerphoto = queryParams.get("photo");

      if (trainername) setTrainerName(trainername);
      if (trainerphoto) setTrainerPhoto(trainerphoto);

      fetchContract();
    }
  }, [user]);

  const fetchContract = async () => {
    try {
      const response = await ClientService.getCurrentTrainerContract();
      setContract(response);
    } catch (error) {
      console.error("Error fetching contract:", error);
      toast.error("Failed to fetch contract data");
    }
  };

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans flex flex-col">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Sidebar ref={sidebarRef} />
      <main className={cn(
        "pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all duration-300 overflow-y-auto no-scrollbar",
        styles.container
      )}>
        <Header
          title={`Your Trainer: ${trainerName}`}
          content={`Sessions remaining: ${contract?.sessionsRemaining || 0}`}
          onMenuToggle={handleMenuToggle}
        />
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row md:flex-1 gap-4 sm:gap-6">
            <CTChatSection
              trainerName={trainerName}
              trainerPhoto={trainerPhoto}
              contract={contract}
            />
            <SchedulingSection
              contract={contract}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CCurrentTrainerPage;