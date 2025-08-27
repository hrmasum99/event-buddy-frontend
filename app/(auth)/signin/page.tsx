import dynamic from "next/dynamic";

const SigninForm = dynamic(() => import("@/components/forms/SigninForm"));

export default function Signin() {
  return (
    // <div className="min-h-screen w-full max-w-sm flex justify-center items-center">
    <SigninForm />
    // </div>
  );
}

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";

// export default function Signin() {
//   return (
//     <Card className="w-full max-w-sm shadow-xl">
//       <CardHeader>
//         <CardTitle className="text-[#242565] text-xl">Sign in</CardTitle>
//         <CardDescription className="mt-4 text-[#8570AD]">
//           New User?
//           <Link href="/signup" className="ps-1 underline">
//             Create an account
//           </Link>
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form>
//           <div className="flex flex-col gap-6">
//             <div className="grid gap-2">
//               <Label className="text-[#242565]" htmlFor="email">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="enter your email"
//                 required
//                 className="border-2 border-[#D9D9D9]"
//               />
//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label className="text-[#242565]" htmlFor="password">
//                   Password
//                 </Label>
//                 <a
//                   href="#"
//                   className="ml-auto inline-block text-sm text-[#8570AD] underline-offset-4 hover:underline"
//                 >
//                   Forgot your password?
//                 </a>
//               </div>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="enter your password"
//                 required
//                 className="border-2 border-[#D9D9D9]"
//               />
//             </div>
//           </div>
//         </form>
//       </CardContent>
//       <CardFooter className="flex-col gap-2">
//         <Button
//           type="submit"
//           className="w-full bg-[#4157FE] hover:bg-[#7B8BFF]"
//         >
//           Sign In
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }
