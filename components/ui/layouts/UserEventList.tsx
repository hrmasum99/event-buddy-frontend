// import { Calendar, Clock, MapPin } from "lucide-react";
// import { Card } from "../card";
// import { Button } from "../button";

// export default function UserEventList() {
//   return (
//     <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
//       <div className="flex items-start gap-4">
//         <div className="flex flex-col items-center justify-center">
//           <span className="text-sm font-bold text-[#3D37F1]">APR</span>
//           <span className="text-3xl font-bold">14</span>
//         </div>

//         <div>
//           <h3 className="text-lg text-[#242565] font-semibold mb-1">
//             Tech Conference 2025
//           </h3>
//           <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
//             <div className="flex items-center gap-1">
//               <Calendar className="w-4 h-4" />
//               Sunday
//             </div>
//             <div className="flex items-center gap-1">
//               <Clock className="w-4 h-4" />
//               3–5 PM
//             </div>
//             <div className="flex items-center gap-1">
//               <MapPin className="w-4 h-4" />
//               San Francisco, CA
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4 sm:mt-0">
//         <Button variant="destructive" className="text-sm px-4 py-2">
//           Cancel registration
//         </Button>
//       </div>
//     </Card>
//   );
// }

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

  if (isLoading) return <p>Loading your bookings...</p>;
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
