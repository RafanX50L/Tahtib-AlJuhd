import { useState } from 'react';
import {
  FaTachometerAlt,
  FaUsers,
  FaUser,
  FaCalendar,
  FaDollarSign,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import logo from '../../assets/images/logo.png'; // Adjust the path as necessary
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "@/store/slices/authSlice";
import { RootState } from '@/store/store';

interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  active?: boolean;
}

const Sidebar = () => {
  const pathadmin = '/admin';
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: FaTachometerAlt, path: `${pathadmin}/dashboard`, active: true },
    { name: 'Trainer Management', icon: FaUsers, path: `${pathadmin}/trainer-management` },
    { name: 'Client Management', icon: FaUser, path: `${pathadmin}/client-management` },
    { name: 'Interview Schedule', icon: FaCalendar, path: `${pathadmin}/interview-schedule` },
    { name: 'Payments', icon: FaDollarSign, path: `${pathadmin}/payments` },
    { name: 'Notifications', icon: FaBell, path: `${pathadmin}/notifications` },
    { name: 'Settings', icon: FaCog, path: `${pathadmin}/settings` },
  ];

  const handleLogout = () => {
    dispatch(logout())
    setDialogOpen(false);
    navigate('/auth?path=login');
    toast.success('Successfully logged out'); 
  };

  return (
    <div className="h-screen w-64 bg-gray-900 pt-5 flex flex-col">
      <div className="px-6 mb-8">
        <div className="flex flex-row items-center">
          <img src={logo} alt="Logo" className="w-12 h-12 mr-3" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Tahtib AlJuhd</h1>
            <p className="text-gray-400 text-sm">Admin Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className= {({isActive})=>`flex items-center px-4 py-3 rounded-md group transition-colors mb-3 ${
                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 ${
                  item.active ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}
              />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
        <div className="space-y-1 ">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <a
                className="flex items-center px-4 py-3 rounded-md group transition-colors text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
                onClick={() => setDialogOpen(true)}
              >
                <FaSignOutAlt className="w-5 h-5 mr-3 text-gray-300 group-hover:text-white" />
                <span>Logout</span>
              </a>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Are you sure you want to log out? You will need to log in again to access your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40"
            className="rounded-full mr-3"
            alt="Admin profile"
          />
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;