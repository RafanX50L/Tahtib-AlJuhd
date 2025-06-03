import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import logo from "../../assets/images/logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const access = localStorage.getItem("accessToken");
  return (
    <header className="bg-slate-900/95 shadow-sm backdrop-blur-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Tahtib AlJuhd Logo"
              className="w-16 h-16 mr-3 rounded-lg bg-indigo-500 p-1 shadow-lg shadow-indigo-500/50"
            />
            <h1 className="text-2xl font-semibold text-slate-100">
              Tahtib AlJuhd
            </h1>
          </div>

          <nav className="hidden md:flex gap-5">
            <Link
              to="#features"
              className="text-slate-300 hover:text-slate-100 relative transition-colors"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="#user-types"
              className="text-slate-300 hover:text-slate-100 relative transition-colors"
            >
              For Whom
            </Link>
            <Link
              to="#how-it-works"
              className="text-slate-300 hover:text-slate-100 relative transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="#contact"
              className="text-slate-300 hover:text-slate-100 relative transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex gap-4 flex-wrap">
            {access ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-900 text-white px-5 py-2 rounded-md shadow-md transition duration-200"
              >
                Continue Browsing
              </Button>
            ) : (
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={() => navigate("/auth?path=login")}
                  variant="outline"
                  className="px-5 py-2 rounded-md border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition duration-200"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/auth?path=register")}
                  className="bg-indigo-500 text-white px-5 py-2 rounded-md shadow-lg hover:bg-white hover:text-indigo-500 border border-indigo-500 transition duration-200"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
