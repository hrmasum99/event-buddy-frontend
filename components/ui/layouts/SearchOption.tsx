"use client";

import { useState } from "react";
import {
  useGetUpcomingEventsQuery,
  useGetPreviousEventsQuery,
} from "@/redux/services/eventApi";

export default function SearchOption() {
  const [query, setQuery] = useState("");

  // Fetch events
  const { data: upcomingEvents } = useGetUpcomingEventsQuery({
    page: 1,
    limit: 100,
  });
  const { data: previousEvents } = useGetPreviousEventsQuery({
    page: 1,
    limit: 100,
  });

  // Combine both event lists
  const allEvents = [
    ...(upcomingEvents?.data || []),
    ...(previousEvents?.data || []),
  ];

  // Filter results by search query
  const results =
    query.trim().length > 0
      ? allEvents.filter((event) =>
          event.title.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Search Input */}
      <div className="flex items-center w-full search-bar-iphone-se search-bar-iphone sm:max-w-md lg:max-w-lg 2xl:max-w-2xl gap-3">
        <input
          type="text"
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-[#BDBBFB]/40 backdrop-blur-md"
        />
        <button className="px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
          Search
        </button>
      </div>

      {/* Results Dropdown */}
      {results.length > 0 && (
        <div className="mt-3 w-full bg-white shadow-lg rounded-lg max-h-64 overflow-y-auto text-left text-sm sm:text-base">
          {results.map((event) => (
            <div
              key={event.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {event.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
