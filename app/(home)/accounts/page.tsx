// "use client";

// import { useState } from "react";
// import { useAuth } from "@/redux/customHooks";
// import ProtectedRoute from "@/components/ui/layouts/ProtectedRoute";
// import { Button } from "@/components/ui/button";
// import {
//   LayoutDashboard,
//   User,
//   Lock,
//   Shield,
//   BarChart3,
//   ChevronRight,
//   Ticket,
//   Receipt,
//   FileText,
// } from "lucide-react";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import AccountOverview from "@/components/ui/layouts/AccountSummary";
// import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
// import TwoFactorAuth from "@/components/forms/TwoFactorAuth";
// import EditProfile from "@/components/forms/EditProfile";
// import AllTickets from "@/components/ui/layouts/AllTickets";
// import AllInvoices from "@/components/ui/layouts/AllInvoices";
// import MyTickets from "@/components/ui/layouts/MyTickets";
// import MyInvoices from "@/components/ui/layouts/MyInvoices";
// import AdminDashboard from "@/components/ui/layouts/AdminDashboard";
// import UserDashboard from "@/components/ui/layouts/UserDashboard";
// // import AdminDashboard from "../admin/page";
// // import UserDashboard from "../user/page";

// type TabType =
//   | "overview"
//   | "profile"
//   | "password"
//   | "2fa"
//   | "tickets"
//   | "invoices"
//   | "dashboard";

// export default function AccountsPage() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState<TabType>("dashboard");
//   const isAdmin = user?.role === "admin";

//   const menuItems = [
//     {
//       id: "dashboard" as TabType,
//       label: "Dashboard",
//       icon: LayoutDashboard,
//       // isLink: false,
//       // href: isAdmin ? "/admin" : "/user",
//       forRole: "both",
//     },
//     {
//       id: "overview" as TabType,
//       label: "Account Overview",
//       icon: BarChart3,
//       forRole: "both",
//     },
//     {
//       id: "profile" as TabType,
//       label: "Edit Profile",
//       icon: User,
//       forRole: "both",
//     },
//     {
//       id: "password" as TabType,
//       label: "Change Password",
//       icon: Lock,
//       forRole: "both",
//     },
//     {
//       id: "2fa" as TabType,
//       label: "Two-Factor Verification",
//       icon: Shield,
//       forRole: "both",
//     },
//     {
//       id: "tickets" as TabType,
//       label: isAdmin ? "All Tickets" : "My Tickets",
//       icon: Ticket,
//       forRole: "both",
//     },
//     {
//       id: "invoices" as TabType,
//       label: isAdmin ? "All Invoices" : "My Invoices",
//       icon: Receipt,
//       forRole: "both",
//     },
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return isAdmin ? <AdminDashboard /> : <UserDashboard />;
//       case "overview":
//         return <AccountOverview />;
//       case "profile":
//         return <EditProfile />;
//       case "password":
//         return <ChangePasswordForm />;
//       case "2fa":
//         return <TwoFactorAuth />;
//       case "tickets":
//         return isAdmin ? <AllTickets /> : <MyTickets />;
//       case "invoices":
//         return isAdmin ? <AllInvoices /> : <MyInvoices />;
//       default:
//         return isAdmin ? <AdminDashboard /> : <UserDashboard />;
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className="px-6 sm:px-14 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Desktop Sidebar - Hidden on lg screens like if size i less than 1024 then hidden */}
//           <aside className="hidden lg:w-64 shrink-0">
//             <nav className="bg-white rounded-lg shadow-sm border p-2 space-y-1">
//               {menuItems.map((item) => {
//                 return (
//                   <Button
//                     key={item.id}
//                     variant="ghost"
//                     onClick={() => setActiveTab(item.id)}
//                     className={cn(
//                       "w-full justify-start gap-3",
//                       activeTab === item.id
//                         ? "bg-[#4157FE] text-white hover:bg-[#3646D5] hover:text-white"
//                         : "hover:bg-gray-100"
//                     )}
//                   >
//                     <item.icon className="h-5 w-5" />
//                     <span className="flex-1 text-left">{item.label}</span>
//                   </Button>
//                 );
//               })}
//             </nav>
//           </aside>

//           {/* Mobile Sidebar - menu <Menu /> for lg (1024) screens transition from left side of the screen not dropdwon*/}
//           <div className="lg:hidden"></div>

//           {/* Main Content */}
//           <main className="flex-1">
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//               {renderContent()}
//             </div>
//           </main>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/redux/customHooks";
import ProtectedRoute from "@/components/ui/layouts/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  Lock,
  Shield,
  BarChart3,
  Ticket,
  Receipt,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AccountOverview from "@/components/ui/layouts/AccountSummary";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import TwoFactorAuth from "@/components/forms/TwoFactorAuth";
import EditProfile from "@/components/forms/EditProfile";
import AllTickets from "@/components/ui/layouts/AllTickets";
import AllInvoices from "@/components/ui/layouts/AllInvoices";
import MyTickets from "@/components/ui/layouts/MyTickets";
import MyInvoices from "@/components/ui/layouts/MyInvoices";
import AdminDashboard from "@/components/ui/layouts/AdminDashboard";
import UserDashboard from "@/components/ui/layouts/UserDashboard";
import Cart from "@/components/ui/layouts/Cart";
import { useRouter, useSearchParams } from "next/navigation";

type TabType =
  | "overview"
  | "profile"
  | "password"
  | "2fa"
  | "tickets"
  | "invoices"
  | "dashboard"
  | "cart";

const VALID_TABS: TabType[] = [
  "dashboard",
  "overview",
  "cart",
  "profile",
  "password",
  "2fa",
  "tickets",
  "invoices",
];

export default function AccountsPage() {
  const { user } = useAuth();
  const router = useRouter(); // 💡 Initialize useRouter
  const searchParams = useSearchParams(); // 💡 Get search params
  // Get the 'tab' parameter from the URL
  // 💡 Derive activeTab from the URL (The Single Source of Truth)
  const urlTab = searchParams.get("tab") as TabType | null;
  const activeTab: TabType =
    urlTab && VALID_TABS.includes(urlTab) ? urlTab : "dashboard"; // Default to dashboard if tab is missing or invalid

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  // 💡 OPTIONAL: Keep the tab in sync if the URL changes without a full page reload (e.g., using Link)
  // useEffect(() => {
  //   const currentTab = searchParams.get("tab") as TabType | null;
  //   if (
  //     currentTab &&
  //     VALID_TABS.includes(currentTab) &&
  //     currentTab !== activeTab
  //   ) {
  //     setActiveTab(currentTab);
  //   }
  // }, [searchParams]); // Re-run when searchParams object changes

  const menuItems = [
    {
      id: "dashboard" as TabType,
      label: "Dashboard",
      icon: LayoutDashboard,
      forRole: "both",
    },
    {
      id: "overview" as TabType,
      label: "Account Overview",
      icon: BarChart3,
      forRole: "both",
    },
    {
      id: "cart" as TabType,
      label: "Cart",
      icon: ShoppingCart,
      forRole: "both",
    },
    {
      id: "profile" as TabType,
      label: "Edit Profile",
      icon: User,
      forRole: "both",
    },
    {
      id: "password" as TabType,
      label: "Change Password",
      icon: Lock,
      forRole: "both",
    },
    {
      id: "2fa" as TabType,
      label: "Two-Factor Verification",
      icon: Shield,
      forRole: "both",
    },
    {
      id: "tickets" as TabType,
      label: isAdmin ? "All Tickets" : "My Tickets",
      icon: Ticket,
      forRole: "both",
    },
    {
      id: "invoices" as TabType,
      label: isAdmin ? "All Invoices" : "My Invoices",
      icon: Receipt,
      forRole: "both",
    },
  ];

  const handleTabChange = (tabId: TabType) => {
    // 1. Update the URL with the new tab ID
    router.replace(`/accounts?tab=${tabId}`, { scroll: false });
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return isAdmin ? <AdminDashboard /> : <UserDashboard />;
      case "overview":
        return <AccountOverview />;
      case "cart":
        return <Cart />;
      case "profile":
        return <EditProfile />;
      case "password":
        return <ChangePasswordForm />;
      case "2fa":
        return <TwoFactorAuth />;
      case "tickets":
        return isAdmin ? <AllTickets /> : <MyTickets />;
      case "invoices":
        return isAdmin ? <AllInvoices /> : <MyInvoices />;
      default:
        return isAdmin ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  const getActiveTabLabel = () => {
    const activeItem = menuItems.find((item) => item.id === activeTab);
    return activeItem?.label || "Dashboard";
  };

  return (
    <ProtectedRoute>
      <div className="px-6 sm:px-14 py-6">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Desktop Sidebar - Visible on lg screens and above (>= 1024px) */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border p-2 space-y-1 sticky top-6">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleTabChange(item.id)}
                  className={cn(
                    "w-full justify-start gap-3",
                    activeTab === item.id
                      ? "bg-[#4157FE] text-white hover:bg-[#3646D5] hover:text-white"
                      : "hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                </Button>
              ))}
            </nav>
          </aside>

          {/* Mobile Sidebar - Slide in from left on screens < 1024px */}
          <div
            className={cn(
              "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
              isMobileMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            )}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <aside
              className={cn(
                "absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-[#242565]">
                    Account Menu
                  </h2>
                  <p className="text-xs text-gray-600">
                    {user?.fullname || "User"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Menu Items */}
              <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleTabChange(item.id)}
                    className={cn(
                      "w-full justify-start gap-3",
                      activeTab === item.id
                        ? "bg-[#4157FE] text-white hover:bg-[#3646D5] hover:text-white"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                  </Button>
                ))}
              </nav>
            </aside>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
