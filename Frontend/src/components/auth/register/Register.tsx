import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import logo from "../../../assets/images/logo.png";
import { AuthService } from "@/services/authService";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "../../../schemas/authSchema";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

type RegisterFormData = z.infer<typeof registerSchema>;

interface GoogleUser {
  access_token: string;
}

interface GoogleProfile {
  name: string;
  email: string;
}

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [profile, setProfile] = useState<GoogleProfile | null>(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "client",
    },
  });

  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
    },
    onError: (error) => {
      console.log("Login Failed:", error);
      toast.error("Google login failed. Please try again.");
    },
  });
  
  // Create a wrapper function that shows the toast first
  const handleGoogleLogin = () => {
    toast.info("IMPORTANT: Please ensure you select the correct role (Client or Trainer) before proceeding. This will determine your experience.", {
      duration: 8000,  // Show for 8 seconds
      // important: true,  Removed 'important' as it is not a valid property
      action: {
        label: "I Understand",
        onClick: () => login()  // Proceed with login after they acknowledge
      }
    });
  };

  const GoogleSignUP = async (googleData: GoogleProfile) => {
    const role = getValues("role");
    const dataToSend = {
      name: googleData.name,
      email: googleData.email,
      password: "",
      role,
    };
    setIsSubmitting(true);
    try {
      const result = await AuthService.GoogleSignUP(dataToSend);
      if (result.data) {
        console.log("Google registration result:", result.data);
        const role = result.data?.user?.role;
        console.log("role", role);
        const route = role === "client" ? "/Dashboard" : `/${role}/Dashboard`;
        navigate(`${route}`);
        toast.success("Google registration successful! Please verify your email.");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
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
          setProfile(res.data as GoogleProfile);
          GoogleSignUP(res.data as GoogleProfile);
        })
        .catch((err) => {
          console.error("Google profile fetch failed:", err);
          toast.error("Failed to fetch Google profile. Please try again.");
        });
    }
  }, [user]);
  

  // log out function to log the user out of google and set the profile array to null
  // const logOut = () => {
  //   googleLogout();
  //   setProfile(null);
  // };

  useEffect(() => {
    // Simulate initial loading (e.g., checking auth status, fetching config)
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const result = await AuthService.registerUser(data);
      if (result.data) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("fanu", { result });
        navigate(
          `/auth/otp-verification?email=${encodeURIComponent(data.email)}`
        );
      }
    } catch (error: unknown) {
      console.error("Registration failedd:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading registration form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-6">
          <img src={logo} className="w-20 h-20" alt="logo image" />
          <h1 className="text-2xl font-bold text-white">Tahtib ALJuhd</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-white">I am a</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 gap-4"
                  disabled={isSubmitting}
                >
                  <div>
                    <RadioGroupItem
                      value="client"
                      id="client"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="client"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-700 p-4 hover:bg-gray-600 hover:cursor-pointer peer-data-[state=checked]:border-indigo-500 [&:has([data-state=checked])]:border-indigo-500"
                    >
                      <span className="text-2xl mb-2">💪</span>
                      <span className="text-white">Client</span>
                      <span className="text-xs text-gray-400 text-center">
                        I want to workout
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="trainer"
                      id="trainer"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="trainer"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-700 p-4 hover:bg-gray-600 hover:cursor-pointer peer-data-[state=checked]:border-indigo-500 [&:has([data-state=checked])]:border-indigo-500"
                    >
                      <span className="text-2xl mb-2">👨‍🏫</span>
                      <span className="text-white">Trainer</span>
                      <span className="text-xs text-gray-400 text-center">
                        I train others
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-xs">{errors.role.message}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="bg-gray-700 border-gray-600 text-white"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-gray-700 border-gray-600 text-white"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="bg-gray-700 border-gray-600 text-white"
                {...register("password")}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-400">
                Use 8 or more characters with a mix of letters, numbers &
                symbols
              </p>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="bg-gray-700 border-gray-600 text-white"
                {...register("confirmPassword")}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-indigo-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-400 hover:underline">
              Privacy Policy
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleLogin}
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
                fill="#4285F4"
              />
              <path
                d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.72 16.7 5.84 14.1H2.18V16.94C4 20.53 7.7 23 12 23Z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.1C5.62 13.43 5.49 12.72 5.49 12C5.49 11.28 5.62 10.57 5.84 9.9V7.06H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.94L5.84 14.1Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 4 3.47 2.18 7.06L5.84 9.9C6.72 7.3 9.14 5.38 12 5.38Z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/auth?path=login"
            className="text-indigo-400 hover:underline"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
