"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logout, selectAuth } from "@/redux/features/authSlice";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  LogOut,
  UserRoundIcon,
  LayoutDashboard,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/redux/customHooks";

export default function MainNav() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use the useAuth hook for consistent auth state
  const {
    isAuthenticated,
    user,
    getLastName,
    getDashboardRoute,
    getInitials,
    isHydrated,
  } = useAuth();

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, router]);

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-end">
        <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
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
              // Authenticated - Show user info and responsive navigation
              <>
                <div className="flex gap-2 items-center">
                  <Avatar className="rounded-full border border-[#250A63] w-8 h-8 flex items-center justify-center">
                    <AvatarFallback className="flex items-center justify-center rounded-full w-full h-full bg-gray-200">
                      <span className="text-sm font-semibold text-[#250A63]">
                        {getInitials()}
                      </span>
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="font-medium text-[#250A63]">
                      {getLastName()}
                    </span>
                    {/* Show role badge */}
                    {user?.role && (
                      <span className="text-xs text-gray-500 capitalize">
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop Navigation - Hidden on small screens */}
                <div className="hidden sm:flex gap-2">
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
                    className="bg-[#4157FE] text-white hover:bg-[#7B8BFF] flex gap-1 items-center disabled:opacity-50"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>

                {/* Mobile Navigation - Three dot menu for small screens */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={getDashboardRoute()}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
