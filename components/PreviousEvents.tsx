"use client";

import { useGetPreviousEventsQuery } from "@/redux/services/eventApi";
import PaginationWithEllipsis from "./CustomPagination";
import EventsCardList from "./ui/layouts/EventCardList";
import { useState } from "react";

export default function PreviousEvents() {
  const [previousPage, setPreviousPage] = useState(1);
  const eventsPerPage = 12;

  // Fetch previous events
  const {
    data: previousEventsData,
    isLoading: previousLoading,
    error: previousError,
  } = useGetPreviousEventsQuery({
    page: previousPage,
    limit: eventsPerPage,
  });

  // Handle pagination for previous events
  const handlePreviousPageChange = (page: number) => {
    setPreviousPage(page);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-[#242565] font-semibold">
          Previous Events
        </h2>
        {previousEventsData?.meta && (
          <span className="text-sm text-gray-500">
            {previousEventsData.meta.total_items} events found
          </span>
        )}
      </div>

      <EventsCardList
        events={previousEventsData?.data || []}
        isLoading={previousLoading}
        error={previousError}
      />

      {/* Pagination for Previous Events */}
      {previousEventsData?.meta && previousEventsData.meta.total_pages > 1 && (
        <div className="flex justify-center">
          <PaginationWithEllipsis
            currentPage={previousPage}
            totalPages={previousEventsData.meta.total_pages}
            onPageChange={handlePreviousPageChange}
          />
        </div>
      )}
    </>
  );
}
