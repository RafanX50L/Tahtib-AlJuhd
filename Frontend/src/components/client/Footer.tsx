import { HelpCircle, Info } from "lucide-react";

const CFooter = () => {
  return (
    <footer className="px-6 py-4 bg-gray-900 mt-8">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          © 2025 Tahtib Al Juhd Client Portal. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <HelpCircle className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Info className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default CFooter;