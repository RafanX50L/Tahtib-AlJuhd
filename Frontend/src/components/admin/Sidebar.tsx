import { LogOut, Grid, Users, User, Calendar, DollarSign, Bell, Settings } from "lucide-react";
import React from "react";

// Placeholder logo import; replace with actual logo path
import logo from "../../assets/images/logo.png";

interface NavItem {
  name: string;
  icon: keyof typeof icons;
  href: string;
  active?: boolean;
}

const icons = { Grid, Users, User, Calendar, DollarSign, Bell, Settings };

const Sidebar = () => {
  const navItems: NavItem[] = [
    { name: "Dashboard", icon: "Grid", href: "#", active: true },
    { name: "Trainer Management", icon: "Users", href: "#" },
    { name: "Client Management", icon: "User", href: "#" },
    { name: "Interview Schedule", icon: "Calendar", href: "#" },
    { name: "Payments", icon: "DollarSign", href: "#" },
    { name: "Notifications", icon: "Bell", href: "#" },
    { name: "Settings", icon: "Settings", href: "#" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 pt-5 flex flex-col">
      <div className="px-6 mb-8">
        <div className="flex flex-row items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 mr-3"
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Tahtib AlJuhd</h1>
            <p className="text-gray-400 text-sm">Admin Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-md group transition-colors ${
                item.active
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {React.createElement(icons[item.icon], {
                className: `w-5 h-5 mr-3 ${
                  item.active ? "text-white" : "text-gray-300 group-hover:text-white"
                }`,
              })}
              <span>{item.name}</span>
            </a>
          ))}
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
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@fitconnect.com</p>
          </div>
        </div>
        <a
          href="#"
          className="mt-4 flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </a>
      </div>
    </div>
  );
};

export default Sidebar;