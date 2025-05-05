import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Settings } from "lucide-react";

interface HeaderButton {
  icon: string;
  tooltip: string;
  hasBadge?: boolean;
}

const Header = () => {
  const buttons: HeaderButton[] = [
    { icon: "Bell", tooltip: "Notifications", hasBadge: true },
    { icon: "Settings", tooltip: "Settings" },
  ];

  return (
    <header className="bg-gray-900 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex flex-row items-center">
        <div className="flex flex-col">
          <h6 className="text-xl font-bold text-white">Trainer Managment</h6 >
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search clients..."
            className="px-4 py-2 border-none bg-gray-800  text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
          <Search
            name="Search"
            className="absolute right-3 border-none top-2.5 text-gray-400 w-4 h-4"
          />
        </div>
        {buttons.map((btn, index) => (
          <div key={index} className="relative group">
            <Button
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              variant="ghost"
            >
              {btn.icon === "Bell" && <Bell className="w-5 h-5" />}
              {btn.icon === "Settings" && <Settings className="w-5 h-5" />}
              {btn.hasBadge && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <span className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1">
              {btn.tooltip}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;