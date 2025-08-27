// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu";
// import { useAuth } from "@/redux/customHooks";
// import { logout } from "@/redux/features/authSlice";
// import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
// import { LogOut, UserRoundIcon } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";

// export default function MainNav() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const {
//     isAuthenticated,
//     isHydrated,
//     getLastName,
//     getInitials,
//     isProfileLoading,
//   } = useAuth();

//   const handleLogout = () => {
//     dispatch(logout());
//     router.push("/");
//   };

//   // Show loading state during initial hydration
//   if (!isHydrated) {
//     return (
//       <div>
//         <NavigationMenu>
//           <NavigationMenuList>
//             <NavigationMenuItem className="flex gap-4 items-center">
//               <div>Loading...</div>
//             </NavigationMenuItem>
//           </NavigationMenuList>
//         </NavigationMenu>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <NavigationMenu>
//         <NavigationMenuList>
//           <NavigationMenuItem className="flex gap-4 items-center">
//             {!isAuthenticated ? (
//               <div className="flex gap-2">
//                 <Button className="bg-[#4157FE] text-white hover:bg-[#7B8BFF]">
//                   <Link href="/signin">Sign in</Link>
//                 </Button>
//                 <Button className="bg-[#4157FE] text-white hover:bg-[#7B8BFF]">
//                   <Link href="/signup">Sign up</Link>
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <div className="flex gap-2 items-center">
//                   <Avatar className="rounded-full border border-[#250A63] w-8 h-8 flex items-center justify-center">
//                     <AvatarFallback className="flex items-center justify-center rounded-full w-full h-full bg-gray-200">
//                       {isProfileLoading ? (
//                         <UserRoundIcon className="h-4 w-4" />
//                       ) : (
//                         <span className="text-sm font-semibold text-[#250A63]">
//                           {getInitials()}
//                         </span>
//                       )}
//                     </AvatarFallback>
//                   </Avatar>

//                   <div className="flex flex-col">
//                     <span className="font-medium text-[#250A63]">
//                       {isProfileLoading ? "Loading..." : getLastName()}
//                     </span>
//                   </div>
//                 </div>
//                 <Button
//                   className="bg-[#4157FE] text-white hover:bg-[#7B8BFF] flex gap-1 items-center"
//                   onClick={handleLogout}
//                 >
//                   <LogOut />
//                   Logout
//                 </Button>
//               </>
//             )}
//           </NavigationMenuItem>
//         </NavigationMenuList>
//       </NavigationMenu>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/redux/customHooks";
import { logout } from "@/redux/features/authSlice";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { LogOut, UserRoundIcon, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function MainNav() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    isAuthenticated,
    isHydrated,
    getLastName,
    getInitials,
    isProfileLoading,
    user,
    getDashboardRoute,
    getRole,
  } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  // Show loading state during initial hydration
  if (!isHydrated) {
    return (
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex gap-4 items-center">
              <div className="animate-pulse">Loading...</div>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  }

  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="flex gap-4 items-center">
            {!isAuthenticated ? (
              // Not authenticated - Show Sign In/Sign Up buttons
              <div className="flex gap-2">
                <Button className="bg-[#4157FE] text-white hover:bg-[#7B8BFF]">
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button className="bg-[#4157FE] text-white hover:bg-[#7B8BFF]">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            ) : (
              // Authenticated - Show user info, dashboard, and logout
              <>
                <div className="flex gap-2 items-center">
                  <Avatar className="rounded-full border border-[#250A63] w-8 h-8 flex items-center justify-center">
                    <AvatarFallback className="flex items-center justify-center rounded-full w-full h-full bg-gray-200">
                      {isProfileLoading ? (
                        <UserRoundIcon className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-semibold text-[#250A63]">
                          {getInitials()}
                        </span>
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="font-medium text-[#250A63]">
                      {isProfileLoading ? "Loading..." : getLastName()}
                    </span>
                    {/* Show role badge */}
                    {getRole() && (
                      <span className="text-xs text-gray-500 capitalize">
                        {getRole()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dashboard Button - Role-based routing */}
                <Button
                  className="bg-[#28a745] text-white hover:bg-[#218838] flex gap-1 items-center"
                  asChild
                >
                  <Link href={getDashboardRoute()}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>

                {/* Logout Button */}
                <Button
                  className="bg-[#4157FE] text-white hover:bg-[#7B8BFF] flex gap-1 items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
