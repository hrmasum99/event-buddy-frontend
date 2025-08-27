"use client";

import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ui/layouts/ProtectedRoute";
import UserEventList from "@/components/ui/layouts/UserEventList";
import { useAuth } from "@/redux/customHooks";
import { useGetMyBookingsQuery } from "@/redux/services/bookingApi";
import Link from "next/link";

export default function UserDashboard() {
  const { user } = useAuth();
  const { data: bookingsResponse, isLoading, error } = useGetMyBookingsQuery();

  const bookings = bookingsResponse?.data || [];

  return (
    <ProtectedRoute requiredRole="user">
      <div className="px-6 sm:px-14 pt-2">
        <div className="mb-4">
          <h5 className="text-xl text-[#242565] font-semibold">Dashboard</h5>
          {user?.fullname && (
            <p className="text-gray-600 mt-1">Welcome back, {user.fullname}!</p>
          )}
        </div>

        <h5 className="text-lg text-[#242565] font-medium mt-4 py-4">
          My Registered Events
        </h5>

        <div>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading your bookings...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Failed to load your bookings. Please try again.
            </div>
          ) : bookings.length > 0 ? (
            <UserEventList />
          ) : (
            <div className="text-gray-500 text-center py-8">
              <p className="mb-4">You haven't registered for any events yet.</p>
              <Button className="bg-[#4157FE] text-white hover:bg-[#7B8BFF]">
                <Link href="/">Browse Events</Link>
              </Button>
            </div>
          )}
        </div>

        {bookings.length > 0 && (
          <div className="flex justify-center w-full py-6">
            <Button className="bg-[#4157FE] text-white hover:bg-[#7B8BFF]">
              <Link href="/">Browse more events</Link>
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
