"use client";

import { useGetUpcomingEventsQuery } from "@/redux/services/eventApi";
import { useState } from "react";
import EventsCardList from "./ui/layouts/EventCardList";
import PaginationWithEllipsis from "./CustomPagination";

export default function UpcommingEvents() {
  const [upcomingPage, setUpcomingPage] = useState(1);
  const eventsPerPage = 12;

  // Fetch upcoming events
  const {
    data: upcomingEventsData,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useGetUpcomingEventsQuery({
    page: upcomingPage,
    limit: eventsPerPage,
  });

  // Handle pagination for upcoming events
  const handleUpcomingPageChange = (page: number) => {
    setUpcomingPage(page);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-[#242565] font-semibold">
          Upcoming Events
        </h2>
        {upcomingEventsData?.meta && (
          <span className="text-sm text-gray-500">
            {upcomingEventsData.meta.total_items} events found
          </span>
        )}
      </div>

      <EventsCardList
        events={upcomingEventsData?.data || []}
        isLoading={upcomingLoading}
        error={upcomingError}
      />

      {/* Pagination for Upcoming Events */}
      {upcomingEventsData?.meta && upcomingEventsData.meta.total_pages > 1 && (
        <div className="flex justify-center pt-8">
          <PaginationWithEllipsis
            currentPage={upcomingPage}
            totalPages={upcomingEventsData.meta.total_pages}
            onPageChange={handleUpcomingPageChange}
          />
        </div>
      )}
    </>
  );
}
