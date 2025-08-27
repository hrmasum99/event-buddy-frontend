// import { Button } from "@/components/ui/button";
// import CreateEvent from "@/components/ui/layouts/EventCreate";
// import EventList from "@/components/ui/layouts/EventList";
// import Link from "next/link";

// export default function AdminDashboard() {
//   return (
//     <div className="px-10 sm:px-14 pt-2">
//       <h5 className="text-xl text-[#242565] font-semibold">Admin Dashboard</h5>
//       <div className="flex justify-between w-full mt-4 py-4">
//         <h5 className="text-lg text-[#242565] font-medium">
//           Events Management
//         </h5>
//         <CreateEvent />
//       </div>

//       <div>
//         <EventList />
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import CreateEvent from "@/components/ui/layouts/EventCreate";
import EventList from "@/components/ui/layouts/EventList";
import ProtectedRoute from "@/components/ui/layouts/ProtectedRoute";
import { useAuth } from "@/redux/customHooks";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="px-10 sm:px-14 pt-2">
        <div className="mb-4">
          <h5 className="text-xl text-[#242565] font-semibold">
            Admin Dashboard
          </h5>
          {user?.fullname && (
            <p className="text-gray-600 mt-1">Welcome back, {user.fullname}!</p>
          )}
        </div>

        <div className="flex justify-between w-full mt-4">
          <h5 className="text-lg text-[#242565] font-medium">
            Events Management
          </h5>
          <CreateEvent />
        </div>

        <div>
          <EventList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
