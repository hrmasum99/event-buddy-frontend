// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import PaginationWithEllipsis from "@/components/pagination-13";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@radix-ui/react-select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../table";
// import { Button } from "../button";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Eye, Pencil, Trash2 } from "lucide-react";
// import EventModal from "./modals/EventModal";

// const data = [
//   {
//     title: "Tech Conference 2025",
//     date: "Sunday, 14 April, 2025",
//     location: "San Francisco, CA",
//     registrations: "130/500",
//   },
//   {
//     title: "Tech Conference 2025",
//     date: "Sunday, 14 April, 2025",
//     location: "San Francisco, CA",
//     registrations: "130/500",
//   },
// ];

// export type Event = {
//   title: string;
//   date: string;
//   location: string;
//   registrations: string;
// };

// export default function EventList() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [search, setSearch] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [openEdit, setOpenEdit] = useState(false);

//   const columns: ColumnDef<Event>[] = [
//     {
//       accessorKey: "title",
//       header: "Title",
//       cell: ({ row }) => (
//         <div className="text-sm font-medium">{row.getValue("title")}</div>
//       ),
//     },
//     {
//       accessorKey: "date",
//       header: "Date",
//       cell: ({ row }) => (
//         <div className="text-sm text-muted-foreground">
//           {row.getValue("date")}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "location",
//       header: "Location",
//       cell: ({ row }) => <div>{row.getValue("location")}</div>,
//     },
//     {
//       accessorKey: "registrations",
//       header: "Registrations",
//       cell: ({ row }) => <div>{row.getValue("registrations")}</div>,
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: () => (
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-indigo-800 hover:bg-indigo-100"
//           >
//             <Eye className="h-4 w-4" />
//           </Button>
//           <Button
//             onClick={() => setOpenEdit(true)}
//             variant="ghost"
//             size="icon"
//             className="text-indigo-800 hover:bg-indigo-100"
//           >
//             <Pencil className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-red-500 hover:bg-red-100"
//           >
//             <Trash2 className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const filteredData = data
//     .filter((event) => event.title.toLowerCase().includes(search.toLowerCase()))
//     .sort((a, b) =>
//       sortOrder === "asc"
//         ? a.date.localeCompare(b.date)
//         : b.date.localeCompare(a.date)
//     );

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: { columnFilters },
//   });

//   return (
//     <div className="w-full space-y-4">
//       {/* Filters */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <Input
//           placeholder="Filter by event title..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full sm:w-[300px]"
//         />
//         <Select value={sortOrder} onValueChange={setSortOrder}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Sort order" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="asc">Ascending</SelectItem>
//             <SelectItem value="desc">Descending</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Table */}
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((group) => (
//               <TableRow key={group.id}>
//                 {group.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="text-center py-6"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <PaginationWithEllipsis />

//       <EventModal
//         open={openEdit}
//         onClose={() => setOpenEdit(false)}
//         mode="edit"
//       />
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { Button } from "../button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import EventModal from "./modals/EventModal";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "@/redux/services/eventApi";

import Link from "next/link";
import { useToast } from "../ToastContext";
import PaginationWithEllipsis from "@/components/CustomPagination";
import { useGetAvailableSeatsQuery } from "@/redux/services/bookingApi";
import { useRouter } from "next/navigation";

// Updated interface to match your IEvent type
export type AdminEvent = {
  id: string | number;
  title: string;
  date: string;
  location: string;
  totalSeats: number;
  imageUrl?: string;
  tags?: string;
  description?: string;
};

export default function EventList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const eventsPerPage = 10;
  const { showToast } = useToast();
  const router = useRouter();

  // Fetch all events using RTK Query
  const {
    data: eventsData,
    isLoading,
    error,
    refetch,
  } = useGetAllEventsQuery({
    page: currentPage,
    limit: eventsPerPage,
  });

  // Delete event mutation
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleEdit = (event: AdminEvent) => {
    setSelectedEvent(event);
    setOpenEdit(true);
  };

  const handleView = (eventId: string | number) => {
    router.push(`/event-details/${eventId}`);
  };

  const handleDelete = async (eventId: string | number) => {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        await deleteEvent(eventId).unwrap();
        refetch();
        showToast({
          type: "success",
          title: "Event Deleted",
          message: "The event has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting event:", error);
        showToast({
          type: "error",
          title: "Delete Failed",
          message: "Failed to delete the event. Please try again.",
        });
      }
    }
  };

  // Fixed sort order change handler
  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as "asc" | "desc");
  };

  // Fixed page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<AdminEvent>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="text-sm font-medium max-w-[200px] truncate">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.getValue("date"))}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="max-w-[150px] truncate">
          {row.getValue("location") || "TBA"}
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: "Registrations",
      cell: ({ row }) => {
        const eventId = row.getValue("id") as number;

        // Fetch seat info for this event
        const { data: seatData, isLoading } =
          useGetAvailableSeatsQuery(eventId);

        if (isLoading) {
          return <span className="text-sm text-gray-500">Loading...</span>;
        }

        const available = seatData?.data.availableSeats ?? 0;
        const total = row.original.totalSeats;
        const registered = total - available;

        return (
          <span className="text-sm font-medium text-gray-700">
            {registered}/{total}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-indigo-800 hover:bg-indigo-100"
            onClick={() => handleView(row.original.id)}
            title="View Event"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleEdit(row.original)}
            variant="ghost"
            size="icon"
            className="text-indigo-800 hover:bg-indigo-100"
            title="Edit Event"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {/* <Button
            onClick={() => handleDelete(row.original.id)}
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100"
            title="Delete Event"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button> */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-100"
                title="Delete Event"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this event?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleDelete(row.original.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  // Process and filter data
  const processedData = useMemo(() => {
    if (!eventsData?.data) return [];
    return eventsData.data
      .filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      )
      .map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        totalSeats: Number(event.totalSeats),
        imageUrl: event.imageUrl,
        tags: event.tags,
        description: event.description,
      }))
      .sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [eventsData, search, sortOrder]);

  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4157FE]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-4">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-red-500">Error loading events</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 py-6">
      {/* Header with stats */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {eventsData?.meta && (
            <span>Showing {eventsData.meta.total_items} total events</span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input
          placeholder="Filter by event title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[300px]"
        />
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {eventsData?.meta && eventsData.meta.total_pages > 1 && (
        <div className="flex justify-center">
          <PaginationWithEllipsis
            currentPage={currentPage}
            totalPages={eventsData.meta.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Edit Modal */}
      <EventModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedEvent(null);
        }}
        mode="edit"
        eventData={selectedEvent}
      />
    </div>
  );
}
