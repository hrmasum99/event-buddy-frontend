import dynamic from "next/dynamic";

const ForgotPasswordForm = dynamic(
  () => import("@/components/forms/ForgotPasswordForm")
  // { ssr: false }
);

export default function ForgotPasswordPage() {
  return (
    // <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">

    <ForgotPasswordForm />
  );
}

export const metadata = {
  title: "Forgot Password | Event Management",
  description: "Reset your password",
};
