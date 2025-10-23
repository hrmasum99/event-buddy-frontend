"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/redux/services/authApi";
import { isRtkQueryError } from "@/lib/utils";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, { message: "Current password is required." }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ChangePasswordForm() {
  const [changePassword] = useChangePasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const result = await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Password changed successfully!");
        form.reset();
      } else {
        toast.error(result.message || "Failed to change password.");
      }
    } catch (caughtError: any) {
      let errorMessage = "An unexpected error occurred.";

      if (isRtkQueryError(caughtError)) {
        const errorData = caughtError.data;
        errorMessage =
          errorData?.message || `Request failed. Status: ${caughtError.status}`;

        // Set error on current password field if it's a wrong password error
        if (errorMessage.toLowerCase().includes("current password")) {
          form.setError("oldPassword", { message: errorMessage });
        }
      } else if (caughtError instanceof Error) {
        errorMessage = caughtError.message;
      }

      toast.error(errorMessage);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#242565]">
          Change Password
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div className="relative sm:max-w-1/2 lg:max-w-1/3">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative sm:max-w-1/2 lg:max-w-1/3">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative sm:max-w-1/2 lg:max-w-1/3">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-[#4157FE] hover:bg-[#3646D5]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Changing..." : "Change Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
