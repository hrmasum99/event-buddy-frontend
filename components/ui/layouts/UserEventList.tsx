"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "../card";
import { Button } from "../button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../alert-dialog"; // adjust import path based on your setup
import {
  useGetMyBookingsQuery,
  useCancelBookingMutation,
} from "@/redux/services/bookingApi";

export default function UserEventList() {
  const { data, isLoading, isError } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();
  const [dialogOpenId, setDialogOpenId] = useState<number | null>(null);

  if (isLoading)
    return (
      // <p>Loading your bookings...</p>
      <div className="w-full space-y-4">
        <div className="flex items-center justify-center h-64">
          <span className="text-xl mr-4">Loading your bookings</span>
          <svg
            className="animate-spin h-5 w-5 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  if (isError) return <p>Failed to load bookings.</p>;
  if (!data?.data?.length) return <p>You have no bookings yet.</p>;

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await cancelBooking(bookingId).unwrap();
      setDialogOpenId(null);
    } catch (error) {
      console.error("Cancel booking failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      {data.data.map((booking) => {
        const { id: bookingId, event, seatsBooked } = booking;
        const eventDate = new Date(event.date);
        const month = eventDate.toLocaleString("default", { month: "short" });
        const day = eventDate.getDate();

        return (
          <Card
            key={bookingId}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 sm:px-6 sm:py-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-[#3D37F1]">
                  {month.toUpperCase()}
                </span>
                <span className="text-3xl font-bold">{day}</span>
              </div>

              <div>
                <h3 className="text-lg text-[#242565] font-semibold mb-1">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {seatsBooked} seat{seatsBooked > 1 ? "s" : ""} booked
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {eventDate.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel Booking Dialog */}
            <div className="mt-4 sm:mt-0">
              <AlertDialog
                open={dialogOpenId === bookingId}
                onOpenChange={(open) =>
                  setDialogOpenId(open ? bookingId : null)
                }
              >
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="text-sm px-4 py-2">
                    Cancel registration
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your registration for "
                      {event.title}"? This action cannot be undone and you will
                      lose your reserved seats.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Registration</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancelBooking(bookingId)}
                      disabled={isCancelling}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isCancelling
                        ? "Cancelling..."
                        : "Yes, Cancel Registration"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
