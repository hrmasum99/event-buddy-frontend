"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl2,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { isRtkQueryError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
} from "@/redux/services/authApi";
import {
  ArrowLeft,
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Step 1: Email Schema
const EmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
});

// Step 2: OTP Schema
const OTPSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "OTP must be 6 digits." })
    .max(6, { message: "OTP must be 6 digits." })
    .regex(/^\d+$/, { message: "OTP must contain only numbers." }),
});

// Step 3: Password Schema
const PasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type Step = "email" | "otp" | "password";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [userEmail, setUserEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  // API mutations
  const [forgotPassword, { isLoading: isSendingOTP }] =
    useForgotPasswordMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  // Forms
  const emailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: { otp: "" },
  });

  const passwordForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  // Start countdown timer
  const startCountdown = () => {
    setCountdown(600); // 10 minutes = 600 seconds
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1: Send OTP
  const handleSendOTP = async (data: z.infer<typeof EmailSchema>) => {
    try {
      const result = await forgotPassword({ email: data.email }).unwrap();

      if (result.success !== false) {
        toast.success(result.message || "OTP sent successfully!");
        setUserEmail(data.email);
        setCurrentStep("otp");
        startCountdown();
      } else {
        toast.error(result.message || "Failed to send OTP.");
        emailForm.setError("email", { message: result.message });
      }
    } catch (caughtError: any) {
      let errorMessage = "Failed to send OTP. Please try again.";

      if (isRtkQueryError(caughtError)) {
        const errorData = caughtError.data;
        errorMessage = errorData?.message || errorMessage;
        emailForm.setError("email", { message: errorMessage });
      }
      toast.error(errorMessage);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (data: z.infer<typeof OTPSchema>) => {
    try {
      const result = await verifyOTP({
        email: userEmail,
        otp: data.otp,
      }).unwrap();

      if (result.success !== false) {
        toast.success(result.message || "OTP verified successfully!");
        setCurrentStep("password");
      } else {
        toast.error(result.message || "Invalid OTP.");
        otpForm.setError("otp", { message: result.message });
      }
    } catch (caughtError: any) {
      let errorMessage = "Invalid or expired OTP.";

      if (isRtkQueryError(caughtError)) {
        const errorData = caughtError.data;
        errorMessage = errorData?.message || errorMessage;
        otpForm.setError("otp", { message: errorMessage });
      }
      toast.error(errorMessage);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (data: z.infer<typeof PasswordSchema>) => {
    try {
      const result = await resetPassword({
        email: userEmail,
        newPassword: data.newPassword,
      }).unwrap();

      if (result.success !== false) {
        toast.success(result.message || "Password reset successful!");
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        toast.error(result.message || "Failed to reset password.");
        passwordForm.setError("newPassword", { message: result.message });
      }
    } catch (caughtError: any) {
      let errorMessage = "Failed to reset password. Please try again.";

      if (isRtkQueryError(caughtError)) {
        const errorData = caughtError.data;
        errorMessage = errorData?.message || errorMessage;
        passwordForm.setError("newPassword", { message: errorMessage });
      }
      toast.error(errorMessage);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      const result = await forgotPassword({ email: userEmail }).unwrap();

      if (result.success !== false) {
        toast.success("OTP resent successfully!");
        startCountdown();
        otpForm.reset();
      } else {
        toast.error(result.message || "Failed to resend OTP.");
      }
    } catch (error: any) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {currentStep !== "email" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentStep === "otp") setCurrentStep("email");
                if (currentStep === "password") setCurrentStep("otp");
              }}
              className="p-0 h-auto"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1">
            <CardTitle className="text-[#242565] text-2xl font-bold">
              {currentStep === "email" && "Forgot Password"}
              {currentStep === "otp" && "Verify OTP"}
              {currentStep === "password" && "Reset Password"}
            </CardTitle>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-4">
          <div
            className={`flex-1 h-2 rounded-full transition-all ${
              currentStep === "email" ? "bg-[#4157FE]" : "bg-[#4157FE]"
            }`}
          />
          <div
            className={`flex-1 h-2 rounded-full transition-all ${
              currentStep === "otp" || currentStep === "password"
                ? "bg-[#4157FE]"
                : "bg-gray-200"
            }`}
          />
          <div
            className={`flex-1 h-2 rounded-full transition-all ${
              currentStep === "password" ? "bg-[#4157FE]" : "bg-gray-200"
            }`}
          />
        </div>

        <CardDescription className="mt-4 text-[#8570AD]">
          {currentStep === "email" &&
            "Enter your email address and we'll send you an OTP to reset your password."}
          {currentStep === "otp" &&
            `We've sent a 6-digit OTP to ${userEmail}. Please enter it below.`}
          {currentStep === "password" &&
            "Create a new strong password for your account."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Step 1: Email Input */}
        {currentStep === "email" && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleSendOTP)}
              className="space-y-6"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#4157FE]" />
                      Email Address
                    </FormLabel>
                    <FormControl2>
                      <Input
                        placeholder="Enter your registered email"
                        {...field}
                      />
                    </FormControl2>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#4157FE] hover:bg-[#7B8BFF] text-sm font-semibold"
                disabled={isSendingOTP}
              >
                {isSendingOTP ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send OTP
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/signin"
                  className="text-sm text-[#8570AD] hover:text-[#4157FE] underline-offset-4 hover:underline"
                >
                  Remember your password? Sign in
                </Link>
              </div>
            </form>
          </Form>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === "otp" && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(handleVerifyOTP)}
              className="space-y-6"
            >
              {countdown > 0 && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    OTP expires in: <strong>{formatTime(countdown)}</strong>
                  </AlertDescription>
                </Alert>
              )}

              {countdown === 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    OTP has expired. Please request a new one.
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#4157FE]" />
                      Enter 6-Digit OTP
                    </FormLabel>
                    <FormControl2>
                      <Input
                        placeholder="000000"
                        {...field}
                        maxLength={6}
                        className="h-14 text-center text-2xl tracking-widest font-semibold"
                        autoComplete="off"
                      />
                    </FormControl2>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#4157FE] hover:bg-[#7B8BFF] text-sm font-semibold"
                disabled={isVerifyingOTP || countdown === 0}
              >
                {isVerifyingOTP ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Verify OTP
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isSendingOTP || countdown > 540} // Disable for first 60 seconds
                  className="text-sm text-[#8570AD] hover:text-[#4157FE] underline-offset-4 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingOTP ? "Sending..." : "Didn't receive OTP? Resend"}
                </button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 3: Password Reset */}
        {currentStep === "password" && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handleResetPassword)}
              className="space-y-6"
            >
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  OTP verified successfully! Create your new password below.
                </AlertDescription>
              </Alert>

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#4157FE]" />
                      New Password
                    </FormLabel>
                    <FormControl2>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl2>
                    <FormMessage />
                    <p className="text-xs text-[#8570AD] mt-1">
                      Password must be at least 8 characters with uppercase,
                      lowercase, number, and special character.
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#4157FE]" />
                      Confirm Password
                    </FormLabel>
                    <FormControl2>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl2>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#4157FE] hover:bg-[#7B8BFF] text-sm font-semibold"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
