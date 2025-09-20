import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

const AdminLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      {/* Mobile sidebar overlay */}
      <div
        className={`${isSidebarOpen ? "block" : "hidden"} fixed inset-0 bg-black/60 z-20 lg:hidden`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-out lg:static lg:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="lg:hidden px-4 py-3 bg-gray-900 flex items-center justify-between sticky top-0 z-10">
          <button
            aria-label="Toggle sidebar"
            className="px-3 py-2 rounded-md bg-gray-800 text-gray-200"
            onClick={() => setIsSidebarOpen((v) => !v)}
          >
            {isSidebarOpen ? "Close" : "Menu"}
          </button>
          <span className="text-sm text-gray-300">Admin</span>
        </div>

        <AppHeader title={title} />
        <main className="px-4 sm:px-6 py-6 sm:py-8">{children}</main>
        <footer className="px-4 sm:px-6 py-4 bg-gray-900 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2025 FitConnect Admin Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Help
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Info
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;


