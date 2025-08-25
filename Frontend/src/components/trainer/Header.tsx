import { RootState } from '@/store/store';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/slices/authSlice';
import { ChevronDown, User, Settings, HelpCircle, LogOut, CalendarDays } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import TrainerNotificationDropdown from './TrainerNotificationDropDown';

interface HeaderProps {
  text: string;
}

const Header: React.FC<HeaderProps> = ({ text }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth?path=login');
  };

  const goToAvailability = () => {
    // If there's an approval flag, check it here before navigate
    // e.g., if (user?.status !== 'approved') { toast.error('Awaiting approval'); return; }
    navigate('/trainer/availability');
  };

  return (
    <div className="flex justify-between items-center mb-8 bg-[#1e1e1e]/70 p-4 rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
      {/* Left side - Page title */}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-[#6366f1]">{text}</h1>
        <p className="text-[#b0b0b0] text-sm mt-1">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Quick action: Set Availability */}
        <Button variant="outline" className="hidden md:flex border-[#2c2c2c] text-[#b0b0b0] hover:bg-[#2c2c2c]" onClick={goToAvailability}>
          <CalendarDays className="w-4 h-4 mr-2" />
          Set Availability
        </Button>

        {/* Notification Dropdown */}
        <TrainerNotificationDropdown />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1e1e1e] transition-all bg-transparent border-none"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#ffffff] text-sm font-medium">
                  {user?.name}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#818cf8] border-2 border-[#6366f1] flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.[0]?.toUpperCase() ?? "T"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#b0b0b0]" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className="w-56 bg-[#1e1e1e] border-[#2c2c2c] shadow-2xl"
            align="end"
          >
            <DropdownMenuLabel className="text-[#ffffff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#818cf8] border-2 border-[#6366f1] flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.name?.[0]?.toUpperCase() ?? "T"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{user?.name ?? "Trainer"}</p>
                  <p className="text-xs text-[#b0b0b0] font-normal">
                    {user?.email ?? "trainer@example.com"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-[#2c2c2c]" />
            
            <DropdownMenuItem className="text-[#b0b0b0] hover:text-[#ffffff] hover:bg-[#6366f1]/10 cursor-pointer" onClick={() => navigate('/trainer/profile')}>
              <User className="w-4 h-4 mr-3" />
              <span>View Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="text-[#b0b0b0] hover:text-[#ffffff] hover:bg-[#6366f1]/10 cursor-pointer" onClick={goToAvailability}>
              <CalendarDays className="w-4 h-4 mr-3" />
              <span>Set Availability</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="text-[#b0b0b0] hover:text-[#ffffff] hover:bg-[#6366f1]/10 cursor-pointer">
              <Settings className="w-4 h-4 mr-3" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-[#2c2c2c]" />
            
            <DropdownMenuItem className="text-[#b0b0b0] hover:text-[#ffffff] hover:bg-[#6366f1]/10 cursor-pointer">
              <HelpCircle className="w-4 h-4 mr-3" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-[#2c2c2c]" />
            
            <DropdownMenuItem 
              className="text-[#ef4444] hover:text-[#f87171] hover:bg-[#ef4444]/10 cursor-pointer" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;