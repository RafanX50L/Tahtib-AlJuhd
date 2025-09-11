import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import NotificationDropdown, { adminTheme } from "@/components/shared/NotificationDropDown";
import { logout } from "@/store/slices/authSlice";

const AppHeader: React.FC<{ title: string }> = ({ title }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header className="bg-gray-900 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-10">
      <div className="flex items-center">
        <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <div className="hidden sm:block">
          <NotificationDropdown theme={adminTheme} navPath="/admin/notification" />
        </div>

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
                <span className="text-white text-sm font-medium truncate">
                  {user?.name ?? "User"}
                </span>
                <span className="text-[#A0A7B8] text-xs truncate">
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

            <div className="sm:hidden">
              <DropdownMenuItem
                className="text-[#A0A7B8] hover:text-white hover:bg-[#2A3042] cursor-pointer"
                onClick={() => navigate("/admin/notification")}
              >
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2A3042]" />
            </div>

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
    </header>
  );
};

export default AppHeader;


