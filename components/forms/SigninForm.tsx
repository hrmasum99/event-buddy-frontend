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
import { useAppDispatch } from "@/redux/hooks";
import { useSigninMutation } from "@/redux/services/authApi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { setLoggedInUser } from "@/redux/features/authSlice";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email({ message: "Invalid email address." }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function SigninForm() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useSigninMutation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const result = await login(data).unwrap(); // This can throw RtkQueryError

      if (result.success === true && result.data.twoFactorRequired) {
        toast.success(result.message || "Two-Factor verification required!");
        // Redirect to a protected page
        router.push(`/2FA?email=${data.email}`);
      } else if (result.success === true && !result.data.twoFactorRequired) {
        toast.success(result.message || "Login successful!");
        // Dispatch actions to store tokens and user info
        dispatch(
          setLoggedInUser({
            access_token: result?.data?.access_token,
            user: result?.data?.user,
            twoFactorRequired: result?.data?.twoFactorRequired,
          })
        );
        // Redirect to a protected page
        router.push("/");
      } else {
        const errorMessage =
          result.message || "Login failed. Please check your credentials.";
        toast.error(errorMessage);
        form.setError("email", { message: errorMessage });
      }
    } catch (caughtError: any) {
      let errorMessage = "An unexpected error occurred during login.";

      if (isRtkQueryError(caughtError)) {
        // This is an HTTP error (e.g., 400, 401, 500) transformed by RTK Query
        const errorData = caughtError.data; // This is your ApiErrorResponse
        errorMessage =
          errorData?.message || `Login failed. Status: ${caughtError.status}`;
        if (
          !form.formState.errors.email &&
          !form.formState.errors.password &&
          errorMessage
        ) {
          form.setError("email", { message: errorMessage });
        }
      } else if (caughtError instanceof Error) {
        errorMessage = caughtError.message;
        form.setError("email", { message: errorMessage });
      }
      toast.error(errorMessage);
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-[#242565] text-xl">Sign in</CardTitle>
        <CardDescription className="mt-4 text-[#8570AD]">
          New User?
          <Link
            href="/signup"
            className="ps-1 underline text-[#8570AD] hover:text-[#4157FE]"
          >
            Create an account
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#242565]">Email</FormLabel>
                    <FormControl2>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl2>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-[#242565]">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-[#8570AD] hover:text-[#4157FE] underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl2>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl2>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#4157FE] hover:bg-[#7B8BFF] text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={form.formState.isSubmitting || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              {/* </CardFooter> */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
