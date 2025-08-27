"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignupMutation } from "@/redux/services/authApi";
import { isRtkQueryError } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl2,
} from "../ui/form";

const FormSchema = z.object({
  fullname: z.string().min(1, { message: "Name is required." }).min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }).min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function SignupForm() {
  const [signup, { isLoading }] = useSignupMutation();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitData = { ...data };
    try {
      const result = await signup(submitData).unwrap(); // This can throw RtkQueryError

      // If unwrap() resolves, the HTTP request was successful (e.g., 2xx status).
      if (result.success === true) {
        toast.success(result.message || "Signup successful!");
        // console.log("Signup successful:", result.data);

        // Redirect to sign in page after successful signup
        router.push("/signin");
      } else {
        // Business logic failure (e.g., API returned 200 OK, but credentials invalid based on `result.success`)
        const errorMessage =
          result.message || "Signup failed. Please Try Again";
        toast.error(errorMessage);
        // Set form errors based on the general message from the successful (but failed logic) response
        form.setError("email", { message: errorMessage });
        // Optionally, you might want to clear the password or set a non-specific error for it
        // form.setError("password", { message: " " }); // Avoids repeating the same error
      }
    } catch (caughtError: any) {
      // 'caughtError' will be RtkQueryError if unwrap() threw
      // console.error("Login failed (in catch block):", caughtError);

      let errorMessage = "An unexpected error occurred during signup.";

      if (isRtkQueryError(caughtError)) {
        // This is an HTTP error (e.g., 400, 401, 500) transformed by RTK Query
        const errorData = caughtError.data; // This is your ApiErrorResponse
        errorMessage =
          errorData?.message || `Signup failed. Status: ${caughtError.status}`;

        // field-specific errors if present (array of errors)
        if (errorData && Array.isArray(errorData.errors)) {
          let formErrorSet = false;
          errorData.errors.forEach((err: any) => {
            if (err.field && err.error) {
              form.setError(err.field, { message: err.error });
              formErrorSet = true;
            }
          });
          // Only show the static message in the toast if field errors were set, but do not override errorMessage for the form
          if (formErrorSet) {
            toast.error("Please correct the errors highlighted.");
            return; // Stop further error handling, since field errors are set and toast is shown
          }
        }

        // If no specific field errors were set from errorData.errors for a 400, or for other statuses like 401, 403, 500
        if (
          !form.formState.errors.email &&
          !form.formState.errors.password &&
          errorMessage
        ) {
          form.setError("email", { message: errorMessage });
        }
      } else if (caughtError instanceof Error) {
        // This would catch a standard JS Error if something else went wrong (e.g., an issue in the success path before returning)
        errorMessage = caughtError.message;
        form.setError("email", { message: errorMessage });
      }
      toast.error(errorMessage);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader>
        <CardTitle className="text-[#242565] text-xl">Sign Up</CardTitle>
        <CardDescription className="mt-4 text-[#8570AD]">
          Already have an account?
          <Link href="/signin" className="ps-1 underline">
            Sign in
          </Link>
        </CardDescription>
        {/* <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl2>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl2>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
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
                    <FormLabel>Password*</FormLabel>
                    <FormControl2>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl2>
                    <div className="flex items-center mt-2">
                      <input
                        id="show-password-checkbox"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword((v) => !v)}
                        className="mr-2 cursor-pointer h-4 w-4"
                      />
                      <label
                        htmlFor="show-password-checkbox"
                        className="text-sm select-none cursor-pointer"
                      >
                        Show password
                      </label>
                    </div>
                    {/* <FormDescription>Must be at least 8 characters.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <CardFooter className="flex-col gap-2"> */}
              <Button
                type="submit"
                className="w-full bg-[#4157FE] hover:bg-[#7B8BFF]"
                disabled={form.formState.isSubmitting || isLoading}
              >
                Sign up
              </Button>
              {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
              {/* </CardFooter> */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
