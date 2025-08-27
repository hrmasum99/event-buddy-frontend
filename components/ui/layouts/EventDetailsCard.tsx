"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import TicketGroup from "@/components/ui/layouts/Ticket-Group";
import { useGetAvailableSeatsQuery } from "@/redux/services/bookingApi";

interface EventDetailsCardProps {
  event: IEvent;
}

export default function EventDetailsCard({ event }: EventDetailsCardProps) {
  const date = new Date(event.date);
  const { data: seatData, isLoading: isLoadingSeats } =
    useGetAvailableSeatsQuery(event.id);

  const seatInfo = seatData?.data;

  const registeredSeats = event.totalSeats - (seatInfo?.availableSeats ?? 0);

  return (
    <Card className="w-full max-w-full shadow-none pt-0 border-0 rounded-none bg-[#FBFBFE]">
      <div className="w-full h-auto">
        <Image
          src={event.imageUrl || "/conference.png"}
          alt={event.title}
          width={3840}
          height={2560}
          priority
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {event.tags?.split(",").map((tag, idx) => (
          <Badge
            key={idx}
            className="bg-[#d7daf7] hover:bg-[#bdc3fa] text-[#1D4ED8] shadow-none rounded-sm"
          >
            <div className="h-1 w-1 rounded-full bg-[#1D4ED8]" /> {tag.trim()}
          </Badge>
        ))}
      </div>

      <CardHeader className="flex flex-row items-center justify-between py-0 px-0">
        <h6 className="text-2xl text-[#242565] leading-none font-medium">
          {event.title}
        </h6>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border border-gray-400 rounded-lg px-6 py-4 mx-4">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-8 w-8 text-[#1D4ED8]" />

            <div className="flex flex-col">
              <span className="text-sm text-[#8570AD]">Date</span>
              <span className="text-sm text-[#8570AD]">
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-8 w-8 text-[#1D4ED8]" />

            <div className="flex flex-col">
              <span className="text-sm text-[#8570AD]">Time</span>
              <span className="text-sm text-[#8570AD]">
                {date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-8 w-8 text-[#1D4ED8]" />

            <div className="flex flex-col">
              <span className="text-sm text-[#8570AD]">Location</span>
              <span className="text-sm text-[#8570AD]">
                {event.location || "Location TBA"}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-14 md:px-32 py-6">
          <TicketGroup eventId={event.id} />
        </div>

        <Card className="shadow-none pt-2 border-0 gap-3">
          <CardHeader className="px-0 pb-0">
            <h5 className="text-lg text-[#242565] font-medium">
              About this event
            </h5>
          </CardHeader>
          <CardContent className="px-0 pt-0 text-[#8570AD] text-sm">
            <p>{event.description}</p>
          </CardContent>
        </Card>
      </CardContent>

      <Separator />

      <CardFooter className="px-0">
        <div className="flex items-center gap-2">
          <Image src="/spots.png" alt="Spot icon" width={14} height={20} />
          {isLoadingSeats ? (
            <span className="text-sm text-[#8570AD]">Loading...</span>
          ) : (
            <>
              <Link href="#" className="text-sm font-semibold text-[#8570AD]">
                {seatInfo?.availableSeats} Spots Left
              </Link>
              <span className="text-sm text-[#46444466] font-semibold">
                ({registeredSeats} registered)
              </span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
