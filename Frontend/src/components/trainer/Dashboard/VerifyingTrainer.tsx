import { useEffect, useState } from "react";
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
import logo from "@/assets/images/logo.png";
import {
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { RootState } from "@/store/store";
import { TrainerService } from "@/services/implementation/trainerServices";
import { ITrainerWithPersonalization } from "@/pages/admin/ATrainerManagment";

const VerifyingTrainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trainerData, setTrainerData] =
    useState<ITrainerWithPersonalization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const status = user?.status;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await TrainerService.getPendingApplicationDetails();

        setTrainerData(response);
        toast.success("Trainer details fetched successfully");

        // setError("No trainer data found");
        // toast.error("No trainer data available");
      } catch (error) {
        console.error("Error fetching trainer details:", error);
        setError("Failed to fetch trainer details");
        toast.error("Error fetching trainer details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    {
      icon: FaTachometerAlt,
      text: "Overview",
      active: true,
      href: "/trainer/verifying",
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setDialogOpen(false);
    navigate("/auth?path=login");
    toast.success("Successfully logged out");
    closeSidebar();
  };

  const renderStatusCard = () => {
    if (isLoading) {
      return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      );
    }

    if (error || !trainerData) {
      return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md text-center">
          <p className="text-red-500">{error || "No data available"}</p>
        </div>
      );
    }

    const { interviewDetails, basicInfo } = trainerData;

    switch (status) {
      case "applied":
        return (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-yellow-400">
                  Application Pending
                </h2>
                <p className="text-sm text-gray-400">
                  Your application is under review.
                </p>
              </div>
            </div>
          </div>
        );

      case "interview_scheduled":
        return (
          <>
            {new Date(trainerData.interviewDetails.endTime).getTime() >=
            new Date().getTime() ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {user?.name || "Trainer"}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(
                            interviewDetails?.interviewDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(
                            interviewDetails?.startTime
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        <span>
                          {new Date(
                            interviewDetails?.endTime
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-green-400 text-sm mb-6">
                  Interview scheduled. Prepare to join!
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() =>
                    navigate(`/room/${interviewDetails?.roomId}`)
                  }
                >
                  Join Now
                </Button>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md text-center">
                <div className="flex flex-col items-center gap-2">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-white text-lg font-semibold">
                    Waiting for Feedback
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Your interview is complete. Please wait while we review your
                    performance.
                  </p>
                </div>
              </div>
            )}
          </>
        );

      case "interviewed":
        return (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-500">
                  Interview Completed
                </h2>
                <p className="text-sm text-gray-400">
                  Awaiting final decision.
                </p>
              </div>
            </div>
            {interviewDetails?.result && (
              <div className="mt-4">
                <h3 className="text-md font-semibold text-white mb-2">
                  Interview Feedback
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  <div>
                    <p>Communication Skills:</p>
                    <p className="text-green-400">
                      {interviewDetails.result.communicationSkills}/10
                    </p>
                  </div>
                  <div>
                    <p>Technical Knowledge:</p>
                    <p className="text-green-400">
                      {interviewDetails.result.technicalKnowledge}/10
                    </p>
                  </div>
                  <div>
                    <p>Coaching Style:</p>
                    <p className="text-green-400">
                      {interviewDetails.result.coachingStyle}/10
                    </p>
                  </div>
                  <div>
                    <p>Confidence & Presence:</p>
                    <p className="text-green-400">
                      {interviewDetails.result.confidencePresence}/10
                    </p>
                  </div>
                  <div>
                    <p>Brand Alignment:</p>
                    <p className="text-green-400">
                      {interviewDetails.result.brandAlignment}/10
                    </p>
                  </div>
                  <div>
                    <p>Equipment Quality:</p>
                    <p className="text-green-400">
                      {interviewDetails.result.equipmentQuality}/10
                    </p>
                  </div>
                </div>
                {interviewDetails.result.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Additional Notes:</p>
                    <p className="text-white">
                      {interviewDetails.result.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case "approved":
        return (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-500">
                  Application Approved
                </h2>
                <p className="text-sm text-gray-400">
                  Welcome to the team! Set up your profile to start coaching.
                </p>
              </div>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate("/trainer/profile/setup")}
            >
              Set Up Profile
            </Button>
          </div>
        );

      case "rejected":
        return (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-red-500">
                  Application Rejected
                </h2>
                <p className="text-sm text-gray-400">
                  Unfortunately, your application was not successful.
                </p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              You can reapply after 6 months.
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md text-center">
            <p className="text-gray-400">
              Unknown status. Please contact support.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#121212] text-[#ffffff]">
      <div>
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeSidebar}
        ></div>
        <button
          className="lg:hidden fixed top-4 left-4 z-30 bg-[#1e1e1e] border-[#2c2c2c] rounded-md p-2 text-[#6366f1] hover:bg-[#2c2c2c] hover:text-[#818cf8] transition-all"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        <aside
          className={`fixed top-0 left-0 w-[280px] h-full bg-[#0f0f13] border-r border-[#2c2c2c] p-6 transition-transform z-20 lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3 mb-8">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <span className="text-[#ffffff] text-xl font-semibold">
              Tahtib AlJuhd
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.text}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-md text-[#b0b0b0] hover:bg-[#6366f1]/10 hover:text-[#6366f1] transition-all ${
                  item.active
                    ? "bg-[#6366f1]/10 text-[#6366f1] border-l-4 border-[#6366f1]"
                    : ""
                }`}
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
            <span className="text-[#ffffff]">
              {trainerData?.name || user?.name || "User"}
            </span>
            <img
              src={
                trainerData?.basicInfo?.profilePhoto || "/api/placeholder/40/40"
              }
              alt="User avatar"
              className="w-10 h-10 rounded-full border-2 border-[#6366f1] object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          {renderStatusCard()}
        </div>
      </main>
    </div>
  );
};

export default VerifyingTrainer;
