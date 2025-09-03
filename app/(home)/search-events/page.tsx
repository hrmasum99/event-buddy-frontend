"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  useGetUpcomingEventsQuery,
  useGetPreviousEventsQuery,
} from "@/redux/services/eventApi";
import PaginationWithEllipsis from "@/components/CustomPagination";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SearchEventList from "@/components/ui/layouts/SearchEventList";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

  // Fetch all events
  const { data: upcomingEvents, isLoading: upcomingLoading } =
    useGetUpcomingEventsQuery({
      page: 1,
      limit: 100, // Get more events for better search results
    });

  const { data: previousEvents, isLoading: previousLoading } =
    useGetPreviousEventsQuery({
      page: 1,
      limit: 100,
    });

  const isLoading = upcomingLoading || previousLoading;

  // Combine and filter events
  const allEvents = [
    ...(upcomingEvents?.data || []),
    ...(previousEvents?.data || []),
  ];

  const filteredEvents = query
    ? allEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.description?.toLowerCase().includes(query.toLowerCase()) ||
          event.tags?.toLowerCase().includes(query.toLowerCase()) ||
          event.location?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  );

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  return (
    <div className="">
      {/* Hero Section with Search Query */}
      <div className="relative">
        <Image
          src="/Hero.jpg"
          alt="Hero Banner"
          width={1920}
          height={610}
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Search Results Header */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 gap-2">
          <Link
            href="/"
            className="absolute top-6 left-6 text-white hover:text-[#4157FE] transition-colors flex items-center gap-2 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-medium text-white mb-2">
            Search Results
          </h1>

          {query && (
            <p className="text-sm sm:text-lg lg:text-xl text-white/90">
              Showing results for:{" "}
              <span className="font-semibold text-[#4157FE]">"{query}"</span>
            </p>
          )}

          <p className="text-xs sm:text-sm lg:text-base text-white/80 mt-2">
            {isLoading
              ? "Searching..."
              : `${filteredEvents.length} events found`}
          </p>
        </div>
      </div>

      {/* Search Results Content */}
      <div className="px-6 sm:px-14 my-10">
        {!query ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-gray-500 text-center">
              <h3 className="text-lg font-semibold mb-2">No Search Query</h3>
              <p className="text-sm">
                Please enter a search term to find events.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block px-6 py-2 bg-[#4157FE] text-white rounded-lg hover:bg-[#7B8BFF] transition"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-[#242565] font-semibold">
                Search Results for "{query}"
              </h2>
              {!isLoading && (
                <span className="text-sm text-gray-500">
                  {filteredEvents.length} events found
                </span>
              )}
            </div>

            {/* Results */}
            <SearchEventList
              events={paginatedEvents}
              isLoading={isLoading}
              error={null}
            />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <PaginationWithEllipsis
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {/* No results message */}
            {!isLoading && filteredEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-gray-500 text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    No Events Found
                  </h3>
                  <p className="text-sm mb-4">
                    No events match your search term "{query}". Try using
                    different keywords.
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-6 py-2 bg-[#4157FE] text-white rounded-lg hover:bg-[#7B8BFF] transition"
                  >
                    Browse All Events
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
