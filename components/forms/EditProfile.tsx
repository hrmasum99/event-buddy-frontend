export default function EditProfile() {
  return (
    <>
      <h1 className="text-red-600">
        Edit Profile wiil come in next beta version!!!
      </h1>
    </>
  );
}

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useAuth } from "@/redux/customHooks";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { toast } from "sonner";
// import { useUpdateProfileMutation } from "@/redux/services/authApi";
// import { isRtkQueryError } from "@/lib/utils";
// import { setUser } from "@/redux/features/authSlice";
// import { useAppDispatch } from "@/redux/hooks";

// const FormSchema = z.object({
//   fullname: z
//     .string()
//     .min(2, { message: "Full name must be at least 2 characters." })
//     .max(100, { message: "Full name must not exceed 100 characters." }),
//   email: z.string().email({ message: "Please enter a valid email address." }),
// });

// export default function EditProfile() {
//   const { user } = useAuth();
//   const dispatch = useAppDispatch();
//   const [updateProfile] = useUpdateProfileMutation();

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       fullname: user?.fullname || "",
//       email: user?.email || "",
//     },
//   });

//   async function onSubmit(data: z.infer<typeof FormSchema>) {
//     try {
//       const result = await updateProfile(data).unwrap();

//       if (result.success) {
//         toast.success(result.message || "Profile updated successfully!");

//         // Update user in Redux store
//         if (result.data) {
//           dispatch(setUser(result.data));
//         }
//       } else {
//         toast.error(result.message || "Failed to update profile.");
//       }
//     } catch (caughtError: any) {
//       let errorMessage = "An unexpected error occurred.";

//       if (isRtkQueryError(caughtError)) {
//         const errorData = caughtError.data;
//         errorMessage =
//           errorData?.message || `Request failed. Status: ${caughtError.status}`;
//       } else if (caughtError instanceof Error) {
//         errorMessage = caughtError.message;
//       }

//       toast.error(errorMessage);
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-xl font-semibold text-[#242565]">Edit Profile</h2>
//         <p className="text-sm text-gray-600 mt-1">
//           Update your personal information
//         </p>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="fullname"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Full Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter your full name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email Address</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="email"
//                     placeholder="Enter your email"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex gap-4">
//             <Button
//               type="submit"
//               className="bg-[#4157FE] hover:bg-[#3646D5]"
//               disabled={form.formState.isSubmitting}
//             >
//               {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
//             </Button>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => form.reset()}
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }
