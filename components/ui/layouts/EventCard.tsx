"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter } from "../card";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { useGetAvailableSeatsQuery } from "@/redux/services/bookingApi";

interface EventCardProps {
  event: IEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const eventId = event.id || "";

  const { data: seatData, isLoading: isLoadingSeats } =
    useGetAvailableSeatsQuery(event.id);

  const seatInfo = seatData?.data;

  // const registeredSeats = event.totalSeats - (seatInfo?.availableSeats ?? 0);

  if (!eventId) {
    console.error("No valid ID found for event:", event);
    return null; // or return error component
  }

  const encodedEventId = encodeURIComponent(eventId);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date
      .toLocaleDateString("en", { month: "short" })
      .toUpperCase();
    const day = date.getDate();
    const dayName = date.toLocaleDateString("en", { weekday: "long" });
    return { month, day, dayName };
  };

  // Format time (assuming date field contains full datetime)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Parse tags
  const parseTags = (tags: string) => {
    if (!tags) return [];
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const dateInfo = formatDate(event.date);
  const timeInfo = formatTime(event.date);
  const tags = parseTags(event.tags);

  // Get image URL with fallback
  // const displayImage = getEventImageWithFallback(event);

  return (
    <Link href={`/event-details/${encodedEventId}`}>
      <Card className="w-full max-w-full py-0 border-0 shadow-2xl gap-0">
        {/* Clickable area */}

        <div className="w-full h-48 relative overflow-hidden rounded-t-lg">
          <Image
            src={event.imageUrl || "/seminer.png"}
            alt={event.title || "Event Image"}
            fill
            className="object-cover"
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized
          />
        </div>

        <div className="px-4">
          <div className="flex flex-row items-start gap-4 py-2">
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-[#3D37F1]">
                {dateInfo.month}
              </span>
              <span className="text-xl font-bold">{dateInfo.day}</span>
            </div>

            <div className="pt-2 truncate">
              <h3 className="text-lg text-[#242565] font-medium mb-1">
                {event.title}
              </h3>
            </div>
          </div>

          <CardDescription className="pb-2">
            <p className="text-xs text-muted-foreground line-clamp-2 truncate">
              {event.description || "No description available."}
            </p>
          </CardDescription>

          <CardContent className="p-0">
            <div className="flex sm:flex-col flex-row items-start gap-2 py-1">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3 text-[#8570AD]" />
                <div className="flex">
                  <span className="text-xs text-[#8570AD]">
                    {dateInfo.dayName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-[#8570AD]" />
                <div className="flex">
                  <span className="text-xs text-[#8570AD]">{timeInfo}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#8570AD]" />
                <div className="flex">
                  <span className="text-xs text-[#8570AD]">
                    {event.location || "Location TBA"}
                  </span>
                </div>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap py-2">
                {tags.slice(0, 3).map((tag, index) => (
                  <div
                    key={index}
                    className="bg-[#d7daf7] hover:bg-[#bdc3fa] text-xs text-[#1D4ED8] shadow-none rounded-sm flex items-center gap-1 p-1"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#1D4ED8]" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-row items-center justify-between gap-4 px-0 py-4">
            <div className="flex items-center gap-2">
              <Image src="/spots.png" alt="Spot icon" width={14} height={20} />
              <div className="text-xs font-medium text-[#8570AD]">
                {seatInfo?.availableSeats} Spots Left
              </div>
            </div>
            <div className="text-xs font-medium text-[#8570AD]">
              Total {event.totalSeats} Seats
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}
