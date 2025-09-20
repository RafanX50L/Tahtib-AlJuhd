import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, Sidebar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import NotificationDropdown, {
  clientTheme,
} from "../shared/NotificationDropDown";

interface HeaderProps {
  title: string;
  content: string;
  onMenuToggle?: () => void;
}
export interface SidebarRef {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, content, onMenuToggle }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6 lg:mb-10 fixed lg:static top-0 left-0 right-0 bg-gradient-to-r from-[#12151E] to-[#1E2235] p-4 lg:p-0 border-b border-[#2A3042] lg:border-none z-10 h-[70px] lg:h-auto shadow-lg lg:shadow-none backdrop-blur-sm lg:backdrop-blur-none">
      {/* Left side with integrated menu button */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg bg-[#1E2235] border border-[#2A3042] text-[#5D5FEF] hover:bg-[#2A3042] hover:text-[#7577F5] hover:border-[#5D5FEF] transition-all duration-200 shadow-md"
          onClick={onMenuToggle}
        >
          <Sidebar className="w-5 h-5" />
        </button>

        {/* Title and Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-3xl font-semibold bg-gradient-to-r from-white via-[#A0A7B8] to-[#5D5FEF] bg-clip-text text-transparent leading-tight truncate">
            {title}
          </h1>
          <p className="text-[#A0A7B8] text-xs md:text-sm lg:text-base mt-1 opacity-90 truncate lg:whitespace-normal">
            {content}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* Notification Dropdown */}
        <div className="hidden sm:block">
          <NotificationDropdown theme={clientTheme} navPath="/notifications" />
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-2 bg-[#1E2235] border border-[#2A3042] rounded-lg hover:bg-[#2A3042] hover:border-[#5D5FEF] transition-all duration-200 shadow-md"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#5D5FEF] to-[#7577F5] border-2 border-[#2A3042] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm md:text-base">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              </div>
              <div className="hidden md:flex flex-col items-start max-w-24">
                <span className="text-white text-sm font-medium truncate w-full overflow-hidden whitespace-nowrap">
                  {user?.name ?? "User"}
                </span>
                <span className="text-[#A0A7B8] text-xs truncate w-full overflow-hidden whitespace-nowrap">
                  {user?.role ?? "Member"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#A0A7B8] hidden md:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 bg-gradient-to-b from-[#12151E] to-[#1E2235] border-[#2A3042] shadow-2xl"
            align="end"
          >
            <DropdownMenuLabel className="text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5D5FEF] to-[#7577F5] border-2 border-[#2A3042] flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{user?.name ?? "User"}</p>
                  <p className="text-xs text-[#A0A7B8] font-normal truncate">
                    {user?.email ?? "user@example.com"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-[#2A3042]" />

            {/* Mobile-only notification item */}
            <div className="sm:hidden">
              <DropdownMenuItem
                className="text-[#A0A7B8] hover:text-white hover:bg-[#2A3042] cursor-pointer"
                onClick={() => navigate("/notifications")}
              >
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2A3042]" />
            </div>

            <DropdownMenuItem
              className="text-[#A0A7B8] hover:text-white hover:bg-[#2A3042] cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <span>View Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="text-[#A0A7B8] hover:text-white hover:bg-[#2A3042] cursor-pointer">
              <span>Account Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="text-[#A0A7B8] hover:text-white hover:bg-[#2A3042] cursor-pointer">
              <span>Preferences</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#2A3042]" />

            <DropdownMenuItem className="text-[#A0A7B8] hover:text-white hover:bg-[#2A3042] cursor-pointer">
              <span>Help & Support</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#2A3042]" />

            <DropdownMenuItem
              className="text-[#FF4757] hover:text-[#FF6B7A] hover:bg-[#2A3042] cursor-pointer"
              onClick={() => dispatch(logout())}
            >
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
