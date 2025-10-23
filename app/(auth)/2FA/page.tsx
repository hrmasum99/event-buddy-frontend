import dynamic from "next/dynamic";

const Verify2FAForm = dynamic(() => import("@/components/forms/Verify2FAForm"));

export default function Signin2FA() {
  return (
    // <div className="min-h-screen w-full max-w-sm flex justify-center items-center">
    <Verify2FAForm />
    // </div>
  );
}
