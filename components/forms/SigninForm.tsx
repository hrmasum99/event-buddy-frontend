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
import {
  Form,
  FormControl2,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function Signin() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useSigninMutation();
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

      if (result.success === true) {
        toast.success(result.message || "Login successful!");
        // Dispatch actions to store tokens and user info
        dispatch(
          setLoggedInUser({
            access_token: result?.data?.access_token,
            user: result?.data?.user,
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
          <Link href="/signup" className="ps-1 underline">
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
                    <FormLabel>Email</FormLabel>
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
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm text-[#8570AD] underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl2>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl2>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div className="grid gap-2">
                <Label className="text-[#242565]" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="enter your email"
                  required
                  className="border-2 border-[#D9D9D9]"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="text-[#242565]" htmlFor="password">
                    Password
                  </Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm text-[#8570AD] underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="enter your password"
                  required
                  className="border-2 border-[#D9D9D9]"
                />
              </div> */}

              {/* <CardFooter className="flex-col gap-2"> */}
              <Button
                type="submit"
                className="w-full bg-[#4157FE] hover:bg-[#7B8BFF]"
                disabled={form.formState.isSubmitting || isLoading}
              >
                Sign In
              </Button>
              {/* </CardFooter> */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
