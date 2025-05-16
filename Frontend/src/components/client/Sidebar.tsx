import { useState } from "react";
import {
  FaBars,
  FaBolt,
  FaHome,
  FaDumbbell,
  FaChartLine,
  FaUsers,
  FaUserTie,
  FaUtensils,
  FaCommentAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../../assets/images/logo.png"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    { icon: FaHome, text: "Dashboard", active: true },
    { icon: FaDumbbell, text: "Workout" },
    { icon: FaChartLine, text: "Progress" },
    { icon: FaUsers, text: "Community" },
    { icon: FaUserTie, text: "Trainer Sessions" },
    { icon: FaUtensils, text: "Meal Guide" },
    { icon: FaCommentAlt, text: "Chat Bot" },
    { icon: FaUser, text: "Profile" },
  ];

  const handleLogout = () => {
    dispatch(logout())
    setDialogOpen(false);
    navigate('/auth?path=login');
    toast.success('Successfully logged out');
    closeSidebar(); // Close sidebar on logout
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
        id="overlay"
      ></div>
      <button
        className="lg:hidden fixed top-4 left-4 z-30 bg-[#1E2235] border border-[#2A3042] rounded-lg p-2 text-[#5D5FEF] hover:bg-[#2A3042] hover:text-[#7577F5] transition-all"
        onClick={toggleSidebar}
        id="menuBtn"
      >
        <FaBars />
      </button>
      <aside
        className={`fixed top-0 left-0 w-[280px] h-full bg-gradient-to-b from-[#12151E] to-[#1E2235] border-r border-[#2A3042] p-6 overflow-y-auto transition-transform z-20 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        id="sidebar"
      >
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="Logo" className="w-15 h-15" />
          <span className="text-[#5D5FEF] text-xl font-semibold">
            Tahtib AlJuhd
          </span>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <a
              key={item.text}
              href="#"
              className={`flex items-center gap-3 p-3 rounded-lg text-[#A0A7B8] hover:bg-[#1E2235] hover:text-white hover:translate-x-1 transition-all ${
                item.active
                  ? "bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white font-medium shadow-lg"
                  : ""
              }`}
            >
              <item.icon className="w-5 text-center" />
              <span>{item.text}</span>
            </a>
          ))}
        </nav>
        <nav className="flex flex-col gap-2 mt-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <a
                className="flex items-center gap-3 p-3 rounded-lg text-[#A0A7B8] hover:bg-[#1E2235] hover:text-white hover:translate-x-1 transition-all cursor-pointer"
                onClick={() => setDialogOpen(true)}
              >
                <FaSignOutAlt className="w-5 text-center" />
                <span>Logout</span>
              </a>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Are you sure you want to log out? You will need to log in again
                  to access your account.
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
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;