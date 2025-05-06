import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loginSchema } from "../../schemas/authSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { AuthService } from "@/services/implementation/authService";
import { Loader2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "@/hooks/Auth.hook";

type LoginForm = z.infer<typeof loginSchema>;

interface GoogleUser {
  access_token: string;
}

interface GoogleProfile {
  email: string;
  name: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const { login } = useAuth();

  const logins = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("Login Success:", codeResponse);
      setUser(codeResponse);
    },
    onError: (error) => {
      console.log("Login Failed:", error);
      toast.error("Google login failed. Please try again.");
    },
  });

  const GoogleSignUP = async (googleData: GoogleProfile) => {
    const dataToSend = {
      email: googleData.email,
      password: "",
    };
    setIsSubmitting(true);
    try {
      console.log("Google data to send:", dataToSend);
      const result = await AuthService.GoogleSignUP(dataToSend);
      console.log("Google registration result:", result.data.token);
      login(result.data.token);
      toast.success("Google registration successful!");
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log("Google profile data:", res.data);
          GoogleSignUP(res.data as GoogleProfile);
        })
        .catch((err) => {
          console.error("Google profile fetch failed:", err);
          toast.error("Failed to fetch Google profile. Please try again.");
        });
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting login data:", data);
      const response = await AuthService.login(data);
      console.log("Login response:", response);
      console.log("token", response.data.token);
      login(response.data.token); // Directly call login from useAuth
      // Navigation is handled by AuthRoute/ProtectedRoute
    } catch (error: unknown) {
      console.log("Login error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading login form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} className="w-20 h-20 mr-2" alt="Tahtib AlJuhd logo" />
          <div>
            <h1 className="text-2xl font-bold text-white">Tahtib AlJuhd</h1>
            <p className="text-sm text-gray-400">Login Page</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white flex items-center justify-center"
              // disabled={isSubmitting}
              onClick={() => logins()}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Login with Google
            </Button>

            <div className="mt-4 text-center text-sm flex justify-between">
              <Link
                to="/auth/forgot-password"
                className="text-indigo-400 hover:text-indigo-300"
              >
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
        </Form>
      </div>
    </div>
  );
}
