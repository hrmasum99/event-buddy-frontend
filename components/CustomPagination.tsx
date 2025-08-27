"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationWithEllipsisProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationWithEllipsis({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationWithEllipsisProps) {
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 1; i <= Math.min(4, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push("ellipsis");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push(1);
        if (totalPages > 4) {
          pages.push("ellipsis");
        }
        for (let i = Math.max(totalPages - 3, 1); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                handlePageClick(currentPage - 1);
              }
            }}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:bg-gray-100"
            }
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(page as number);
                }}
                isActive={currentPage === page}
                className="cursor-pointer hover:bg-gray-100"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                handlePageClick(currentPage + 1);
              }
            }}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:bg-gray-100"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
