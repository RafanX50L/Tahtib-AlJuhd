import { User } from "lucide-react";
import React from "react";

const Header:React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-8 bg-[#1e1e1e]/70 p-4 rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
      <h1 className="text-2xl font-semibold text-[#6366f1]">
        Trainer Profile 
      </h1>
      <div className="flex items-center gap-4 cursor-pointer p-2 rounded-md hover:bg-[#1e1e1e] transition-all">
        <span className="text-[#ffffff]">Alex Johnson</span>
        <div className="w-10 h-10 rounded-full border-2 border-[#6366f1] bg-[#6366f1]/20 flex items-center justify-center">
          <User className="w-6 h-6 text-[#6366f1]" />
        </div>
      </div>
    </div>
  );
};

export default Header;
