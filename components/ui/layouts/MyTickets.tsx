"use client";

import { useGetMyTicketsQuery } from "@/redux/services/bookingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MyTickets() {
  const { data: ticketsResponse, isLoading, error } = useGetMyTicketsQuery();

  const tickets = ticketsResponse?.data || [];

  const handleDownload = async (url: string, eventTitle: string) => {
    try {
      // Open in new tab for download
      window.open(url, "_blank");
      toast.success("Ticket download started!");
    } catch (error) {
      toast.error("Failed to download ticket");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#242565]">My Tickets</h2>
          <p className="text-sm text-gray-600 mt-1">
            Loading your event tickets...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#242565]">My Tickets</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500 text-center">
              Failed to load tickets. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-[#242565]">My Tickets</h2>
          <p className="text-sm text-gray-600 mt-1">
            View and download your event tickets
          </p>
        </div>
        {tickets.length > 0 && (
          <span className="text-sm text-gray-500">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No tickets found</p>
            <p className="text-sm text-gray-400">
              Your event tickets will appear here after successful booking
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket: any) => (
            <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#4157FE]" />
                    <CardTitle className="text-base">
                      Ticket #{ticket.id}
                    </CardTitle>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {ticket.event && (
                  <>
                    <div>
                      <p className="font-medium text-[#242565]">
                        {ticket.event.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(ticket.event.date), "MMM dd, yyyy")}
                      </span>
                    </div>

                    {ticket.event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {ticket.event.location}
                        </span>
                      </div>
                    )}
                  </>
                )}

                <div className="text-xs text-gray-500 pt-2 border-t">
                  Issued: {format(new Date(ticket.createdAt), "MMM dd, yyyy")}
                </div>

                <Button
                  onClick={() =>
                    handleDownload(
                      ticket.url,
                      ticket.event?.title || `Ticket-${ticket.id}`
                    )
                  }
                  className="w-full bg-[#4157FE] hover:bg-[#3646D5]"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Ticket
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
