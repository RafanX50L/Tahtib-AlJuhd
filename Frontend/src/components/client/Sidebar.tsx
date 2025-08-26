import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
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
import { NavLink, useNavigate } from "react-router-dom";
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

interface SidebarRef {
  toggleSidebar: () => void;
}

const Sidebar = forwardRef<SidebarRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Expose toggleSidebar method to parent components
  useImperativeHandle(ref, () => ({
    toggleSidebar
  }));

  const navItems = [
    { icon: FaHome, text: "Dashboard", path: "/dashboard" },
    { icon: FaDumbbell, text: "Workout", path: "/workouts" },
    { icon: FaChartLine, text: "Progress", path: "/progress" },
    { icon: FaUsers, text: "Community", path: "/community" },
    { icon: FaUserTie, text: "Trainer Sessions", path: "/trainerSession" },
    { icon: FaUtensils, text: "Meal Guide", path: "/diet" },
    { icon: FaCommentAlt, text: "Chat Bot", path: "/chat" },
    { icon: FaUser, text: "Profile", path: "/profile" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setDialogOpen(false);
    navigate('/auth?path=login');
    toast.success('Successfully logged out');
    closeSidebar();
  };

  // Close sidebar when clicking on nav items (mobile)
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-[280px] h-full bg-gradient-to-b from-[#12151E] to-[#1E2235] border-r border-[#2A3042] p-6 overflow-y-auto transition-transform duration-300 z-20 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="Logo" className="w-12 h-12 md:w-15 md:h-15" />
          <span className="text-[#5D5FEF] text-xl font-semibold">
            Tahtib AlJuhd
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.text}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg text-[#A0A7B8] hover:bg-[#1E2235] hover:text-white hover:translate-x-1 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white font-medium shadow-lg"
                    : ""
                }`
              }
            >
              <item.icon className="w-5 text-center flex-shrink-0" />
              <span>{item.text}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="mt-8 pt-4 border-t border-[#2A3042]">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-3 p-3 rounded-lg text-[#A0A7B8] hover:bg-[#1E2235] hover:text-white hover:translate-x-1 transition-all duration-200 w-full text-left"
                onClick={() => setDialogOpen(true)}
              >
                <FaSignOutAlt className="w-5 text-center flex-shrink-0" />
                <span>Logout</span>
              </button>
            </DialogTrigger>
            
            <DialogContent className="bg-gradient-to-b from-[#12151E] to-[#1E2235] text-white border-[#2A3042] max-w-md shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Confirm Logout</DialogTitle>
                <DialogDescription className="text-[#A0A7B8]">
                  Are you sure you want to log out? You will need to log in again
                  to access your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  className="bg-[#2A3042] text-white border-[#2A3042] hover:bg-[#1E2235] hover:border-[#5D5FEF] transition-all duration-200"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] hover:from-[#4B4DEF] hover:to-[#6365F5] transition-all duration-200"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;