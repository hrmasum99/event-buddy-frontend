"use client";

import { useState } from "react";
import {
  useGetUpcomingEventsQuery,
  useGetPreviousEventsQuery,
} from "@/redux/services/eventApi";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchOption() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Fetch events
  const { data: upcomingEvents } = useGetUpcomingEventsQuery({
    page: 1,
    limit: 12,
  });
  const { data: previousEvents } = useGetPreviousEventsQuery({
    page: 1,
    limit: 12,
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

  const handleView = (eventId: string | number) => {
    setQuery(""); // Clear search when navigating
    router.push(`/event-details/${eventId}`);
  };

  // Handle search button click - navigate to search results page
  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search-events?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Search Input */}
      <div className="flex items-center w-full search-bar-iphone-se search-bar-iphone sm:max-w-md lg:max-w-lg 2xl:max-w-2xl gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="
            flex-1
            px-2 py-1 text-xs   /* smaller on mobile */
            sm:px-4 sm:py-2 sm:text-base
            rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            bg-[#BDBBFB]/40 backdrop-blur-md
          "
        />
        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-2 sm:px-6 py-1 sm:py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-sm sm:text-base sm:gap-2"
        >
          <Search className="w-4 h-4 sm:mr-2 inline sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Results Dropdown - Fixed positioning */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 w-full search-bar-iphone-se search-bar-iphone sm:max-w-md lg:max-w-lg 2xl:max-w-2xl mx-auto bg-white shadow-lg rounded-lg max-h-64 overflow-y-auto border border-gray-200">
          {results.slice(0, 8).map((event) => (
            <div
              key={event.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-left"
              onClick={() => handleView(event.id)}
            >
              <div className="text-sm font-medium text-gray-900 truncate">
                {event.title}
              </div>
              <div className="text-xs text-gray-500 truncate mt-1">
                {new Date(event.date).toLocaleDateString()} • {event.location}
              </div>
            </div>
          ))}
          {results.length > 8 && (
            <div
              className="px-4 py-3 text-center text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t border-gray-200"
              onClick={handleSearch}
            >
              View all {results.length} results
            </div>
          )}
        </div>
      )}
    </div>
  );
}
