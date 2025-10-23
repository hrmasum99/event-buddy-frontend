"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, isRtkQueryError } from "@/lib/utils";
import { set2FAEnabled } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useDisable2FAMutation } from "@/redux/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/redux/customHooks";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type Props = {
  open: boolean;
  onClose: (open: boolean) => void;
};

export default function Disable2FAForm({ open, onClose }: Props) {
  const { user } = useAuth();
  const [disable2FA] = useDisable2FAMutation();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user?.email,
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const result = await disable2FA(data).unwrap();
      if (result.success) {
        toast.success(result.message || "2FA disabled successfully!");
        dispatch(set2FAEnabled(false));
        form.reset({ email: user?.email || "", password: "" });
        onClose(false);
      } else {
        toast.error(result.message || "Unable to disable 2FA.");
      }
    } catch (caughtError: any) {
      let message = "An error occurred.";
      if (isRtkQueryError(caughtError)) {
        message = (caughtError.data as any)?.message || message;
        form.setError("password", { message });
      }
      toast.error(message);
    }
  }

  const handleClose = () => {
    form.reset({ email: user?.email || "", password: "" });
    onClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn("max-h-7/8 overflow-y-auto w-full max-w-md", "p-6 gap-5")}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-normal text-lg">
            Disable Two-Factor Authentication
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter your password to disable 2FA for your account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
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

            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-900 font-medium mb-1">Warning:</p>
              <p className="text-xs text-red-800">
                Disabling two-factor authentication will make your account less
                secure. You can enable it again at any time.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-1/2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="w-1/2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Disabling..." : "Disable 2FA"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
