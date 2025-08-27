import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EventDetailsCard from "@/components/ui/layouts/EventDetailsCard";
import { getEventById } from "@/lib/getEventById";

interface EventDetailsProps {
  params: Promise<{ id: string }>; // Changed: params is now a Promise
}

export default async function EventDetails({ params }: EventDetailsProps) {
  // Await the params before using its properties
  const { id } = await params;

  // fetch event by ID
  const event = await getEventById(id);

  if (!event) {
    return (
      <div className="px-6 sm:px-14 my-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found.</h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-14 my-6 bg-[#FBFBFE]">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to event
        </Link>
      </div>

      {/* pass fetched event */}
      <EventDetailsCard event={event} />
    </div>
  );
}
