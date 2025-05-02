import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Dumbbell, BarChart2, Users, Calendar, Utensils, MessageSquare, User, LogOut, Menu, X } from "lucide-react";
import logo from "../../assets/images/logo.png";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Workout Plan", path: "/workout-plan", icon: Dumbbell },
    { name: "Progress", path: "/progress", icon: BarChart2 },
    { name: "Community", path: "/community", icon: Users },
    { name: "Trainer Sessions", path: "/trainer-sessions", icon: Calendar },
    { name: "Meal Guide", path: "/meal-guide", icon: Utensils },
    { name: "Chat Bot", path: "/chat-bot", icon: MessageSquare },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Logout", path: "/logout", icon: LogOut },
  ];

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-gray-400 w-56 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-56 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center p-4 border-b border-gray-800">
          <img src={logo} className="w-10 h-10 mr-2" alt="Tahtib ALJuhd logo" />
          <h1 className="text-xl font-bold text-white">Tahtib ALJuhd</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-indigo-400"
                }`
              }
              onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
            >
              <link.icon
                className={`h-5 w-5 mr-3 ${
                  link.path === "/dashboard" ? "text-black" : "text-gray-400"
                }`}
              />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay for Mobile (when sidebar is open) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Layout;