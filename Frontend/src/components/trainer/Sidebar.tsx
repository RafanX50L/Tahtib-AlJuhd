import { useState } from 'react';
import { FaBars, FaTachometerAlt, FaCalendarAlt, FaUsers, FaComments, FaStar, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/images/logo.png'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
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
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    { icon: FaTachometerAlt, text: 'Overview', active: true, href: 'index.html' },
    { icon: FaCalendarAlt, text: 'Schedule', href: 'schedule.html' },
    { icon: FaUsers, text: 'Clients', href: 'clients.html' },
    { icon: FaComments, text: 'Messages', href: 'messages.html' },
    { icon: FaStar, text: 'Reviews', href: '#' },
    { icon: FaUser, text: 'Profile', href: '#' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setDialogOpen(false);
    navigate('/auth?path=login');
    toast.success('Successfully logged out');
    closeSidebar(); // Close sidebar on logout for mobile
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
      ></div>
      <button
        className="lg:hidden fixed top-4 left-4 z-30 bg-[#1e1e1e] border-[#2c2c2c] rounded-md p-2 text-[#6366f1] hover:bg-[#2c2c2c] hover:text-[#818cf8] transition-all"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>
      <aside
        className={`fixed top-0 left-0 w-[280px] h-full bg-[#0f0f13] border-r border-[#2c2c2c] p-6 transition-transform z-20 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="Logo" className="w-15 h-15" />
          <span className="text-[#ffffff] text-xl font-semibold">Tahtib AlJuhd</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.text}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-md text-[#b0b0b0] hover:bg-[#6366f1]/10 hover:text-[#6366f1] transition-all ${item.active ? 'bg-[#6366f1]/10 text-[#6366f1] border-l-4 border-[#6366f1]' : ''}`}
            >
              <item.icon className="w-5 text-center" />
              <span>{item.text}</span>
            </a>
          ))}
        </nav>
        <nav className="flex flex-col gap-1 mt-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <a
                className="flex items-center gap-3 p-3 rounded-md text-[#b0b0b0] hover:bg-[#6366f1]/10 hover:text-[#6366f1] transition-all cursor-pointer"
                onClick={() => setDialogOpen(true)}
              >
                <FaSignOutAlt className="w-5 text-center" />
                <span>Logout</span>
              </a>
            </DialogTrigger>
            <DialogContent className="bg-[#1e1e1e] text-white border-[#2c2c2c] max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription className="text-[#b0b0b0]">
                  Are you sure you want to log out? You will need to log in again to access your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="bg-[#2c2c2c] text-white border-[#2c2c2c] hover:bg-[#3c3c3c]"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#6366f1] hover:bg-[#818cf8]"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;