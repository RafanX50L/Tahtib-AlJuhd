import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface HeaderButton {
  icon: string;
  tooltip: string;
  hasBadge?: boolean;
}

const Header = () => {
  const buttons: HeaderButton[] = [
    { icon: "Search", tooltip: "Search" },
    { icon: "Bell", tooltip: "Notifications", hasBadge: true },
    { icon: "Settings", tooltip: "Settings" },
  ];

  return (
    <header className="bg-gray-900 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
      </div>
      <div className="flex items-center space-x-4">
        {buttons.map((btn, index) => (
          <div key={index} className="relative group">
            <Button
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              variant="ghost"
            >
              <LucideIcon name={btn.icon} className="w-5 h-5" />
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