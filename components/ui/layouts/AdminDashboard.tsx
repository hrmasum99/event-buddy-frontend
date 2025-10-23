import { useAuth } from "@/redux/customHooks";
import CreateEvent from "./EventCreate";
import EventList from "./EventList";
import ProtectedRoute from "./ProtectedRoute";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
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
