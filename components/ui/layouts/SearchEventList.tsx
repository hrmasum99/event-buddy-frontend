"use client";

import EventCard from "./EventCard";

interface EventsListProps {
  events: IEvent[];
  isLoading: boolean;
  error: any;
}

export default function SearchEventList({
  events,
  isLoading,
  error,
}: EventsListProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-center h-64">
          <span className="text-xl mr-4">Loading events</span>
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
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold mb-2">Error Loading Events</h3>
          <p className="text-sm">
            {error.data?.message ||
              "Failed to load events. Please try again later."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-4 pt-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
