"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn, isRtkQueryError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEnable2FAMutation } from "@/redux/services/authApi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import QRCode from "react-qr-code";
import CopyToClipboard from "../CopyToClipboard";
import { useAuth } from "@/redux/customHooks";
import { set2FAEnabled } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Eye, EyeOff } from "lucide-react";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, { message: "Password is required." }),
});

type Props = {
  open: boolean;
  onClose: (open: boolean) => void;
};

export default function Enable2FAForm({ open, onClose }: Props) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [enable2FA] = useEnable2FAMutation();
  const [qrData, setQrData] = useState<{
    qrCode: string;
    otpauthUrl: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user?.email || "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const result = await enable2FA(data).unwrap();

      if (result.success === true) {
        toast.success(result.message || "2FA setup successful!");
        setQrData(result.data);
        dispatch(set2FAEnabled(true));
      } else {
        toast.error(result.message || "Failed to enable 2FA.");
      }
    } catch (caughtError: any) {
      let errorMessage = "An unexpected error occurred.";

      if (isRtkQueryError(caughtError)) {
        const errorData = caughtError.data;
        errorMessage =
          errorData?.message || `Request failed. Status: ${caughtError.status}`;
      } else if (caughtError instanceof Error) {
        errorMessage = caughtError.message;
      }

      toast.error(errorMessage);
    }
  }

  const handleClose = () => {
    setQrData(null);
    form.reset();
    onClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn("max-h-7/8 overflow-y-auto w-full max-w-md", "p-6 gap-5")}
      >
        <DialogHeader className="p-0">
          <DialogTitle className="font-normal text-lg">
            Enable Two-Factor Authentication
          </DialogTitle>
          <DialogDescription className="text-sm">
            {!qrData
              ? "Enter your password to generate a QR code for 2FA setup."
              : "Scan the QR code with your authenticator app."}
          </DialogDescription>
        </DialogHeader>

        {!qrData ? (
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
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
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

              <DialogFooter>
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
                  className="w-1/2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Generating..."
                    : "Generate QR Code"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCode value={qrData.otpauthUrl} size={200} />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Scan this QR code using your authenticator app (e.g., Google
              Authenticator, Authy) or copy the setup key manually below.
            </p>

            <div className="w-full">
              <p className="text-xs text-gray-500 mb-2 text-center">
                Setup Key:
              </p>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <code className="flex-1 text-sm font-mono break-all">
                  {qrData.otpauthUrl.split("secret=")[1]?.split("&")[0] ||
                    "N/A"}
                </code>
                <CopyToClipboard
                  text={
                    qrData.otpauthUrl.split("secret=")[1]?.split("&")[0] || ""
                  }
                  className="w-4 h-4 flex-shrink-0"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 w-full">
              <p className="text-sm text-blue-900 font-medium mb-2">
                Important:
              </p>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>Save this QR code or setup key in a secure location</li>
                <li>You'll need your authenticator app to sign in</li>
                <li>Don't share this code with anyone</li>
              </ul>
            </div>

            <DialogFooter className="mt-4 w-full">
              <Button
                className="w-full bg-[#4157FE] hover:bg-[#3646D5]"
                onClick={handleClose}
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
