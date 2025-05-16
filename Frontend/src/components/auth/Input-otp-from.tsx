import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import logo from '../../assets/images/logo.png';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { otpSchema } from "@/schemas/authSchema";
import { AuthService } from "@/services/implementation/authService";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";

type OTPFormData = z.infer<typeof otpSchema>;

export function OTPVerificationPage() {
  const [isLoading, setIsLoading] = useState(true); // For initial page load
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes
  const [showResend, setShowResend] = useState(false); // Control resend link visibility
  const [isExpired, setIsExpired] = useState(false); // Track OTP expiration
  const location = useLocation();

  const dispath = useDispatch();
  const navigate = useNavigate();


  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Timer logic
  useEffect(() => {
    if (secondsRemaining <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        const newSeconds = prev - 1;
        if (newSeconds <= 240) { // Show resend after 1 minute (300 - 60 = 240 seconds)
          setShowResend(true);
        }
        if (newSeconds <= 0) {
          setIsExpired(true);
        }
        return newSeconds;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  // Initial page load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    console.log("Loading OTP verification page...");
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const onSubmit = async (data: OTPFormData) => {
    if (isExpired) {
      form.setError("otp", { message: "OTP has expired. Please request a new one." });
      toast.error("OTP has expired. Please request a new one.");
      return;
    }
    setIsSubmitting(true);
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email") ?? "";
    try {
      console.log("Submitting OTP:", data.otp);
      const response = await AuthService.verifyOtp({ ...data, email });
      console.log(`OTP verification response with Status ${response.status}`);
      dispath(setCredentials({ user: response.user , accessToken:response.accessToken}))
      toast.success(response.message);
      navigate(`/dashboard`)
    } catch (error: unknown) {
      console.error("OTP verification failed:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      form.setError("otp", { message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email") ?? "";
    try {
      await AuthService.resentOtp(email);
      setSecondsRemaining(300); // Reset timer to 5 minutes
      setIsExpired(false);
      setShowResend(false); // Hide resend link until 1 minute passes again
      form.reset(); // Clear OTP input
      toast.success("New OTP sent to your email.");
    } catch (error: unknown) {
      console.error("Resend OTP failed:", error);
      let errorMessage = "Failed to resend OTP. Please try again.";
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
          <p className="mt-4 text-white">Loading OTP verification form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-6">
          <img src={logo} className="w-20 h-20" alt="Tahtib ALJuhd logo" />
          <h1 className="text-2xl font-bold text-white">Tahtib ALJuhd</h1>
        </div>

        {/* OTP Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-2/3 space-y-6 flex flex-col items-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-3 items-center">
                  <FormLabel className="text-white text-lg">One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} disabled={isSubmitting || isExpired}>
                      <InputOTPGroup className="gap-x-2">
                        <InputOTPSlot
                          index={0}
                          className="bg-gray-700 border-2 border-gray-600 text-white w-12 h-12 text-center rounded-lg font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <InputOTPSlot
                          index={1}
                          className="bg-gray-700 border-2 border-gray-600 text-white w-12 h-12 text-center rounded-lg font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <InputOTPSlot
                          index={2}
                          className="bg-gray-700 border-2 border-gray-600 text-white w-12 h-12 text-center rounded-lg font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <InputOTPSlot
                          index={3}
                          className="bg-gray-700 border-2 border-gray-600 text-white w-12 h-12 text-center rounded-lg font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <InputOTPSlot
                          index={4}
                          className="bg-gray-700 border-2 border-gray-600 text-white w-12 h-12 text-center rounded-lg font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <InputOTPSlot
                          index={5}
                          className="bg-gray-700 border-2 border-gray-600 text-white w-12 h-12 text-center rounded-lg font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-gray-400 text-center">
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <div className="text-sm text-gray-400 text-center">
                    OTP expires in: <span className={isExpired ? "text-red-500" : "text-white"}>{formatTime(secondsRemaining)}</span>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-all duration-200"
              disabled={isSubmitting || isExpired}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>

        {/* Resend OTP Link */}
        {showResend && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Didn’t receive the OTP?{" "}
            <button
              onClick={handleResendOtp}
              className="text-indigo-400 hover:underline focus:outline-none disabled:opacity-50"
              disabled={isSubmitting}
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}