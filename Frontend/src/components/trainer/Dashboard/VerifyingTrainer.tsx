import { useState } from "react";
// import Sidebar from '../Sidebar'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaBars, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logo from "@/assets/images/logo.png"; // Adjust the path as necessary
import { Calendar, Clock, User, Users } from "lucide-react";
import { RootState } from "@/store/store";

const VerifyingTrainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const status = user?.status;

  // if (status === "interview_scheduled") {
  // }
  // if (status === "rejected") {
  // }

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    {
      icon: FaTachometerAlt,
      text: "Overview",
      active: true,
      href: "index.html",
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setDialogOpen(false);
    navigate("/auth?path=login");
    toast.success("Successfully logged out");
    closeSidebar(); // Close sidebar on logout for mobile
  };

  return (
    <>
      <div className="min-h-screen flex font-sans bg-[#121212] text-[#ffffff]">
        <div>
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={closeSidebar}
          ></div>
          <button
            className="lg:hidden fixed top-4 left-4 z-30 bg-[#1e1e1e] border-[#2c2c2c] rounded-md p-2 text-[#6366f1] hover:bg-[#2c2c2c] hover:text-[#818cf8] transition-all"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
          <aside
            className={`fixed top-0 left-0 w-[280px] h-full bg-[#0f0f13] border-r border-[#2c2c2c] p-6 transition-transform z-20 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center gap-3 mb-8">
              <img src={logo} alt="Logo" className="w-15 h-15" />
              <span className="text-[#ffffff] text-xl font-semibold">
                Tahtib AlJuhd
              </span>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.text}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-md text-[#b0b0b0] hover:bg-[#6366f1]/10 hover:text-[#6366f1] transition-all ${item.active ? "bg-[#6366f1]/10 text-[#6366f1] border-l-4 border-[#6366f1]" : ""}`}
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
                      Are you sure you want to log out? You will need to log in
                      again to access your account.
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
        <main className="flex-1 ml-0 lg:ml-[280px] p-4 lg:p-8">
          <div className="flex justify-between items-center mb-8 bg-[#1e1e1e]/70 p-4 rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
            <h1 className="text-2xl font-semibold text-[#6366f1]">Dashboard</h1>
            <div className="flex items-center gap-4 cursor-pointer p-2 rounded-md hover:bg-[#1e1e1e] transition-all">
              <span className="text-[#ffffff]">Alex Johnson</span>
              <img
                src="/api/placeholder/40/40"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-[#6366f1] object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col items-center pt-30">
            {status === "interview_scheduled" && (
              <div className="bg-gray-800 rounded-lg border  border-gray-700 p-6 w-full max-w-md">
                {/* Profile section */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Mike Johnson
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Apr 17, 2025</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>01:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status text */}
                <div className="text-green-400 text-sm mb-6">
                  Starting in 1h 17m 42s
                </div>

                {/* Join button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  Join Now
                </button>
              </div>
            )}

            {status === "applied" && (
              <div className="bg-gray-800 rounded-lg border justify-items-center border-gray-700 p-6 w-full max-w-md">
                {/* Profile section */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg pl-5 font-semibold text-yellow-400">
                      Application Approval on Pending
                    </h2>
                  </div>
                </div>
              </div>
            )}

            {status === "rejected" && (
              <div className="bg-gray-800 rounded-lg border justify-items-center border-gray-700 p-6 w-full max-w-md">
                {/* Profile section */}
                <div className="flex items-center gap-4 mb-4 pr-5">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg  font-semibold text-red-500">
                      Application got Rejected
                    </h2>
                  </div>
                </div>
                {/* Status text */}
                <div className="text-green-400 text-sm pl-5 justify-items-center">
                  You can try again after 6 months
                </div>
              </div>
            )}

            {status === "interviewed" && (
              <div className="bg-gray-800 rounded-lg border justify-items-center border-gray-700 p-6 w-full max-w-md">
                {/* Profile section */}
                <div className="flex items-center gap-4 mb-4 pr-5">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg  font-semibold text-green-500">
                      Interview Completed
                    </h2>
                  </div>
                </div>
                {/* Status text */}
                <div className="text-amber-200 text-sm pl-5 justify-items-center">
                  Wait for the response
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default VerifyingTrainer;
