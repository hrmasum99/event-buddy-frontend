"use client";

import { useState } from "react";
import EventCard from "./EventCard";

interface EventsListProps {
  events: IEvent[];
  isLoading: boolean;
  error: any;
}

export default function EventsCardList({
  events,
  isLoading,
  error,
}: EventsListProps) {
  if (isLoading) {
    return (
      // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-3 pt-4">
      //   {Array.from({ length: 8 }).map((_, index) => (
      //     <div key={index} className="w-full">
      //       <div className="animate-pulse">
      //         <div className="bg-gray-200 h-48 w-full rounded-t-lg mb-4"></div>
      //         <div className="px-2">
      //           <div className="flex gap-4 mb-4">
      //             <div className="bg-gray-200 h-12 w-12 rounded"></div>
      //             <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
      //           </div>
      //           <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
      //           <div className="bg-gray-200 h-4 w-2/3 rounded mb-4"></div>
      //           <div className="flex gap-2 mb-4">
      //             <div className="bg-gray-200 h-4 w-16 rounded"></div>
      //             <div className="bg-gray-200 h-4 w-20 rounded"></div>
      //             <div className="bg-gray-200 h-4 w-24 rounded"></div>
      //           </div>
      //           <div className="bg-gray-200 h-4 w-full rounded"></div>
      //         </div>
      //       </div>
      //     </div>
      //   ))}
      // </div>
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

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="text-gray-500 text-center">
          <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
          <p className="text-sm">There are currently no events to display.</p>
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
