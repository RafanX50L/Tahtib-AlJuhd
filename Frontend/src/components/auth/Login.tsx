import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { AuthService } from "@/services/authService";
import { Loader2 } from "lucide-react";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (response.status === 200) {
        const userData = response.data as { user: { role: string } };
        const role = userData.user.role;
        navigate(`/${role}`);
        toast.success("Login successful!");
      }
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
              variant="outline"
              className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white flex items-center justify-center"
              disabled={isSubmitting}
              onClick={() => toast.info("Google login not implemented yet.")}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Login with Google
            </Button>

            <div className="mt-4 text-center text-sm flex justify-between">
              <Link to="#" className="text-indigo-400 hover:text-indigo-300">
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
