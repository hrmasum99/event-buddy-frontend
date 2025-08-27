import dynamic from "next/dynamic";

const SignupForm = dynamic(() => import("@/components/forms/SignupForm"));

export default function Signup() {
  return (
    <div className="min-h-screen w-full max-w-sm flex justify-center items-center">
      <SignupForm />
    </div>
  );
}

// export default function Signup() {
//   return (
//     <Card className="w-full max-w-sm shadow-xl">
//       <CardHeader>
//         <CardTitle className="text-[#242565] text-xl">Sign Up</CardTitle>
//         <CardDescription className="mt-4 text-[#8570AD]">
//           Already have an account?
//           <Link href="/signin" className="ps-1 underline">
//             Sign in
//           </Link>
//         </CardDescription>
//         {/* <CardAction>
//           <Button variant="link">Sign Up</Button>
//         </CardAction> */}
//       </CardHeader>
//       <CardContent>
//         <form>
//           <div className="flex flex-col gap-6">
//             <div className="grid gap-2">
//               <Label className="text-[#242565]" htmlFor="email">
//                 Full Name
//               </Label>
//               <Input
//                 id="fullname"
//                 type="text"
//                 placeholder="e.g. John Doe"
//                 required
//                 className="border-2 border-[#D9D9D9]"
//               />
//             </div>
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
//               {/* <div className="flex items-center"> */}
//               <Label className="text-[#242565]" htmlFor="password">
//                 Password
//               </Label>
//               {/* <a
//                   href="#"
//                   className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                 >
//                   Forgot your password?
//                 </a> */}
//               {/* </div> */}
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
//           Sign up
//         </Button>
//         {/* <Button variant="outline" className="w-full">
//           Login with Google
//         </Button> */}
//       </CardFooter>
//     </Card>
//   );
// }
