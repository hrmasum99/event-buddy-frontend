import dynamic from "next/dynamic";

const SignupForm = dynamic(() => import("@/components/forms/SignupForm"));

export default function Signup() {
  return (
    <div className="min-h-screen w-full max-w-sm flex justify-center items-center">
      <SignupForm />
    </div>
  );
}
