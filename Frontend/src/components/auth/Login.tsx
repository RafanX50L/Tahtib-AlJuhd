import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center mb-6">
          <img src={logo} className="text-indigo-500 w-20 h-20 mr-2" />
          <div>
            <h1 className="text-2xl font-bold text-white">Tahtib AlJuhd</h1>
            <p className="text-sm text-gray-400">Login Page</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-400">
              Email
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username or email"
              className="bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-400">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              className="bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </Button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Login with Google
          </Button>

          <div className="mt-4 text-center text-sm">
            <Link to="#" className="text-indigo-400 hover:text-indigo-300 mr-4">
              Forgot Password?
            </Link>
            <Link
              to="/auth?path=register"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
