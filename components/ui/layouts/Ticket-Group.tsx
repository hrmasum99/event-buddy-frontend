"use client";

import React, { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { CircleCheck, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "../card";
import { Button } from "../button";
import {
  useCreateBookingMutation,
  useGetAvailableSeatsQuery,
} from "@/redux/services/bookingApi";
import { useAuth } from "@/redux/customHooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TicketGroupProps {
  eventId: number;
}

export default function TicketGroup({ eventId }: TicketGroupProps) {
  const [selectedSeats, setSelectedSeats] = useState("1");
  const { user } = useAuth();
  const router = useRouter();

  const { data: seatData, isLoading: isLoadingSeats } =
    useGetAvailableSeatsQuery(eventId);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const availableSeats = seatData?.data?.availableSeats || 0;

  // Generate options based on available seats
  const options = Array.from(
    { length: Math.min(4, availableSeats) },
    (_, i) => ({
      value: (i + 1).toString(),
      label: i === 0 ? "Seat" : "Seats",
    })
  );

  const handleBookSeat = async () => {
    console.log("=== BOOK SEAT CLICKED ===");
    console.log("User:", user);
    console.log("Event ID:", eventId);
    console.log("Selected seats:", selectedSeats);

    if (!user) {
      console.log("No user found, redirecting to signin");
      toast.error("Please log in to book seats");
      router.push("/signin");
      return;
    }

    const seatsToBook = parseInt(selectedSeats);
    console.log("Seats to book (parsed):", seatsToBook);

    // Frontend validation
    if (isNaN(seatsToBook) || seatsToBook < 1) {
      console.log("Invalid seats number");
      toast.error("Please select a valid number of seats");
      return;
    }

    if (seatsToBook > 4) {
      console.log("Too many seats selected");
      toast.error("You can book a maximum of 4 seats");
      return;
    }

    if (seatsToBook > availableSeats) {
      console.log("Not enough seats available");
      toast.error(`Only ${availableSeats} seats are available`);
      return;
    }

    console.log("=== MAKING API CALL ===");
    console.log("Payload:", { eventId, seatsBooked: seatsToBook });

    try {
      const result = await createBooking({
        eventId,
        seatsBooked: seatsToBook,
      });

      console.log("=== API CALL RESULT ===");
      console.log("Full result:", result);
      console.log("Result type:", typeof result);
      console.log("Result keys:", Object.keys(result || {}));

      if ("error" in result) {
        console.log("=== BOOKING ERROR ===");
        console.log("Error object:", result.error);

        // Handle validation errors from the backend
        const error = result.error as any;
        let errorMessage = "Failed to book seats. Please try again.";

        if (error?.data?.message) {
          if (Array.isArray(error.data.message)) {
            // Multiple validation errors
            errorMessage = error.data.message.join(". ");
          } else {
            // Single error message
            errorMessage = error.data.message;
          }
        } else if (error?.message) {
          errorMessage = error.message;
        }

        console.log("Final error message:", errorMessage);
        toast.error(errorMessage);
        return;
      }

      if ("data" in result) {
        console.log("=== BOOKING SUCCESS ===");
        console.log("Success data:", result.data);
        toast.success(
          `Successfully booked ${seatsToBook} seat${
            seatsToBook > 1 ? "s" : ""
          }!`
        );
        router.push("/user");
      } else {
        console.log("=== UNEXPECTED RESULT ===");
        console.log("No data or error in result:", result);
      }
    } catch (error: any) {
      console.log("=== EXCEPTION CAUGHT ===");
      console.error("Exception details:", {
        error,
        errorType: typeof error,
        errorKeys: Object.keys(error || {}),
        errorString: JSON.stringify(error, null, 2),
        errorStatus: error?.status,
        errorData: error?.data,
        errorMessage: error?.message,
        originalError: error?.originalError,
      });

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        error?.error ||
        `Failed to book seats. Please try again.`;
      toast.error(errorMessage);
    }
  };

  if (isLoadingSeats) {
    return (
      <Card className="border border-gray-400 rounded-lg py-4">
        <CardHeader>
          <h5 className="text-lg text-[#242565] font-medium">
            Select Number of Seats
          </h5>
        </CardHeader>
        <CardContent className="px-10 pt-0">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center w-full pb-2">
          <Button disabled className="bg-gray-400">
            Loading seats...
          </Button>
        </CardFooter>
      </Card>
    );
  }

  console.log("=== TICKET GROUP DEBUG INFO ===");
  console.log("Event ID:", eventId, typeof eventId);
  console.log("Seat data:", seatData);
  console.log("Available seats:", availableSeats);
  console.log("Selected seats:", selectedSeats);
  console.log("User:", user);
  console.log("Is booking:", isBooking);
  console.log("Is loading seats:", isLoadingSeats);
  console.log("================================");

  if (availableSeats === 0) {
    return (
      <Card className="border border-gray-400 rounded-lg py-4">
        <CardHeader>
          <h5 className="text-lg text-[#242565] font-medium">
            Event Fully Booked
          </h5>
        </CardHeader>
        <CardContent className="px-10 pt-0 text-center">
          <p className="text-gray-600">
            Sorry, this event is fully booked. No seats are available.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center w-full pb-2">
          <Button disabled className="bg-gray-400">
            Fully Booked
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-400 rounded-lg py-4">
      <CardHeader>
        <h5 className="text-lg text-[#242565] font-medium">
          Select Number of Seats
        </h5>
        <p className="text-sm text-[#8570AD]">
          {availableSeats} seat{availableSeats !== 1 ? "s" : ""} available
        </p>
      </CardHeader>
      <CardContent className="px-10 pt-0">
        <RadioGroup.Root
          value={selectedSeats}
          onValueChange={setSelectedSeats}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          {options.map((option) => (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              className={cn(
                "relative group ring-[1px] ring-border rounded py-2 px-3 text-center cursor-pointer transition-all",
                "data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500",
                "hover:ring-blue-300"
              )}
            >
              <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-blue-500 stroke-white group-data-[state=unchecked]:hidden" />
              <div className="flex justify-center w-full">
                <Ticket className="mb-2.5 text-[#242565] h-6 w-6" />
              </div>

              <span className="font-semibold tracking-tight text-[#242565]">
                {option.value}
              </span>
              <p className="font-semibold text-sm pt-2 text-[#8570AD]">
                {option.label}
              </p>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </CardContent>

      <CardFooter className="flex justify-center w-full pb-2">
        <Button
          className="bg-[#4157FE] text-white hover:bg-[#7B8BFF] disabled:bg-gray-400"
          onClick={handleBookSeat}
          disabled={isBooking || availableSeats === 0}
        >
          {isBooking ? "Booking..." : "Book Seat"}
        </Button>
      </CardFooter>
    </Card>
  );
}
