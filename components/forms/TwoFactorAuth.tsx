// export default function TwoFactorAuth() {
//   return (
//     <>
//       <h1>2FA will be comming soon!!!</h1>
//     </>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/redux/customHooks";
import { Shield, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";
import Enable2FAForm from "@/components/forms/Enable2FAForm";
import Disable2FAForm from "@/components/forms/Disable2FAForm";

export default function TwoFactorAuth() {
  const { user, is2FAEnabled } = useAuth();
  const [showEnableForm, setShowEnableForm] = useState(false);
  const [showDisableForm, setShowDisableForm] = useState(false);

  // Use isTwoFactorEnabled from user object
  const isTwoFactorEnabled = user?.isTwoFactorEnabled || is2FAEnabled || false;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#242565]">
          Two-Factor Authentication
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Add an extra layer of security to your account
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              {isTwoFactorEnabled ? (
                <div className="p-3 bg-green-100 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
              ) : (
                <div className="p-3 bg-gray-100 rounded-full">
                  <ShieldOff className="h-6 w-6 text-gray-600" />
                </div>
              )}
            </div>

            <div className="flex-1 w-full md:w-auto">
              <h3 className="font-semibold text-base md:text-lg mb-2">
                {isTwoFactorEnabled
                  ? "Two-Factor Authentication is Enabled"
                  : "Two-Factor Authentication is Disabled"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {isTwoFactorEnabled
                  ? "Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app when signing in."
                  : "Protect your account by enabling two-factor authentication. You'll need an authenticator app like Google Authenticator or Authy."}
              </p>

              <div className="space-y-3">
                {!isTwoFactorEnabled ? (
                  <>
                    <Button
                      onClick={() => setShowEnableForm(true)}
                      className="w-full md:w-auto bg-[#4157FE] hover:bg-[#3646D5]"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">
                        Enable Two-Factor Authentication
                      </span>
                      <span className="sm:hidden">Enable 2FA</span>
                    </Button>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 md:p-4">
                      <h4 className="font-medium text-xs md:text-sm text-blue-900 mb-2">
                        How it works:
                      </h4>
                      <ul className="text-xs md:text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Download an authenticator app on your phone</li>
                        <li>Scan the QR code we'll provide</li>
                        <li>Enter the 6-digit code when signing in</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setShowDisableForm(true)}
                      variant="destructive"
                      className="w-full md:w-auto"
                    >
                      <ShieldOff className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">
                        Disable Two-Factor Authentication
                      </span>
                      <span className="sm:hidden">Disable 2FA</span>
                    </Button>

                    <div className="bg-green-50 border border-green-200 rounded-md p-3 md:p-4">
                      <h4 className="font-medium text-xs md:text-sm text-green-900 mb-2">
                        Your account is secure
                      </h4>
                      <p className="text-xs md:text-sm text-green-800">
                        Two-factor authentication adds an extra layer of
                        security to your account by requiring a code from your
                        authenticator app in addition to your password.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm md:text-base mb-3">
            Recommended Authenticator Apps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="border rounded-lg p-3 md:p-4">
              <h4 className="font-medium text-sm md:text-base mb-1">
                Google Authenticator
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Available for iOS and Android
              </p>
            </div>
            <div className="border rounded-lg p-3 md:p-4">
              <h4 className="font-medium text-sm md:text-base mb-1">
                Microsoft Authenticator
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Available for iOS and Android
              </p>
            </div>
            <div className="border rounded-lg p-3 md:p-4">
              <h4 className="font-medium text-sm md:text-base mb-1">Authy</h4>
              <p className="text-xs md:text-sm text-gray-600">
                Available for iOS, Android, and Desktop
              </p>
            </div>
            <div className="border rounded-lg p-3 md:p-4">
              <h4 className="font-medium text-sm md:text-base mb-1">
                1Password
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Built-in authenticator feature
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enable 2FA Modal */}
      <Enable2FAForm open={showEnableForm} onClose={setShowEnableForm} />

      {/* Disable 2FA Modal */}
      <Disable2FAForm open={showDisableForm} onClose={setShowDisableForm} />
    </div>
  );
}
