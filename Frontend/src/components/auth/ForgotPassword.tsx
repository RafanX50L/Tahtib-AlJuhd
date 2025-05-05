import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { AuthService } from "@/services/implementation/authService";
import { toast } from "sonner";
import { forgotPasswordSchema } from "../../schemas/authSchema";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Requesting password reset for email:", data.email);
      const response = await AuthService.forgotPassword(data.email);
      console.log("Password reset response:", response.data);
      toast.success("Password reset link sent to your email.");
      setIsLinkSent(true);
      form.reset();
    } catch (error: unknown) {
      console.error("Password reset request failed:", error);
      let errorMessage = "Failed to send password reset link. Please try again.";
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
          <p className="mt-4 text-white">Loading forgot password form...</p>
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

        {/* Forgot Password Form */}
        {isLinkSent ? (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Reset Password Link Sent
            </h2>
            <p className="text-gray-400">
              A reset password link has been sent to your email. Please check your inbox (and spam/junk folder) to proceed.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-lg">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-all duration-200"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}