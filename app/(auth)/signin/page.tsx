import dynamic from "next/dynamic";

const SigninForm = dynamic(() => import("@/components/forms/SigninForm"));

export default function Signin() {
  return (
    // <div className="min-h-screen w-full max-w-sm flex justify-center items-center">
    <SigninForm />
    // </div>
  );
}
