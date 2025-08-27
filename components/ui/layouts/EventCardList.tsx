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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-3 pt-4 pb-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="w-full">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-48 w-full rounded-t-lg mb-4"></div>
              <div className="px-2">
                <div className="flex gap-4 mb-4">
                  <div className="bg-gray-200 h-12 w-12 rounded"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                </div>
                <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                  <div className="bg-gray-200 h-4 w-20 rounded"></div>
                  <div className="bg-gray-200 h-4 w-24 rounded"></div>
                </div>
                <div className="bg-gray-200 h-4 w-full rounded"></div>
              </div>
            </div>
          </div>
        ))}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-3 pt-4 pb-10">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
