"use client";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { isRtkQueryError } from "@/lib/utils";
import { setLoggedInUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useVerify2FAMutation } from "@/redux/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "../ui/input";

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "OTP must be at least 6 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
});

export default function Verify2FAForm() {
  const searchParams = useSearchParams();
  // const verification_token = searchParams.get("token"); // Get a specific parameter
  // const rememberMe = searchParams.get("rememberMe"); // Get a specific parameter
  // const trust = searchParams.get("trust"); // Get a specific parameter
  const getEmail = searchParams.get("email"); // Get a specific parameter
  // const mfaMethod = searchParams.get("method"); // Get a specific parameter
  // const totp_enabled = searchParams.get("totp_enabled"); // Get a specific parameter

  const dispatch = useAppDispatch();
  const [verify2FA] = useVerify2FAMutation();
  // const [sendVerificationEmail, { isLoading }] = useSendVerificationEmailMutation();
  const router = useRouter();

  // const [email, setEmail] = useState<"email">(
  //   getEmail = "email"
  // );
  const requiredEmail = getEmail as string;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
      email: requiredEmail,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // const result = await verify2FA({
      //   // verification_token: verification_token,
      //   email: data.email,
      //   code: data.otp,
      //   // method: method,
      //   // trust: trust === "true",
      // }).unwrap();
      const result = await verify2FA(data).unwrap();

      if (result.success === true) {
        toast.success(result.message || "Login successful!");
        // Dispatch actions to store tokens and user info
        dispatch(
          setLoggedInUser({
            access_token: result?.data?.access_token,
            // refresh_token: result?.data?.refresh_token,
            user: result?.data?.user,
            twoFactorRequired: result?.data?.two_factor_enabled,
            // rememberMe: rememberMe === "true",
          })
        );
        // Redirect to a protected page
        router.push("/");
      } else {
        const errorMessage =
          result.message || "Login failed. Please check your 2FA code.";
        toast.error(errorMessage);
      }
    } catch (caughtError: any) {
      let errorMessage = "An unexpected error occurred during login.";

      if (isRtkQueryError(caughtError)) {
        const errorData = caughtError.data;
        errorMessage =
          errorData?.message || `Login failed. Status: ${caughtError.status}`;
      } else if (caughtError instanceof Error) {
        errorMessage = caughtError.message;
      }
      toast.error(errorMessage);
    }
  }

  return (
    <Card className="shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold leading-10">
          2FA Verification
        </CardTitle>
        <CardDescription className="font-normal text-base leading-6">
          Enter OTP from authenticator app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span>Enter your 6-digit code</span>
                      {/* <span>
                        <b>{formatTime(timeLeft)}</b>
                      </span> */}
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        containerClassName="w-full justify-between"
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 items-center justify-between">
                <Button
                  type="submit"
                  className="w-full rounded px-6 bg-[#4157FE] hover:bg-[#7B8BFF]"
                  disabled={form.formState.isSubmitting}
                >
                  Verify
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
