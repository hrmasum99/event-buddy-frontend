"use client";

import { useState } from "react";
import { useGetAllTicketsQuery } from "@/redux/services/bookingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  FileText,
  Calendar,
  MapPin,
  Ticket,
  Search,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AllTickets() {
  const { data: ticketsResponse, isLoading, error } = useGetAllTicketsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const tickets = ticketsResponse?.data || [];

  // Filter tickets based on search
  const filteredTickets = tickets.filter((ticket: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.id.toString().includes(searchLower) ||
      ticket.event?.title?.toLowerCase().includes(searchLower) ||
      ticket.user?.fullname?.toLowerCase().includes(searchLower) ||
      ticket.user?.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleDownload = async (url: string, ticketId: number) => {
    try {
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
          <h2 className="text-xl font-semibold text-[#242565]">All Tickets</h2>
          <p className="text-sm text-gray-600 mt-1">
            Loading all event tickets...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-32 bg-gray-200 rounded"></div>
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
          <h2 className="text-xl font-semibold text-[#242565]">All Tickets</h2>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#242565]">All Tickets</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage all event tickets in the system
          </p>
        </div>
        {tickets.length > 0 && (
          <span className="text-sm text-gray-500">
            {filteredTickets.length} of {tickets.length} ticket
            {tickets.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by ticket ID, event name, user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No tickets found</p>
            <p className="text-sm text-gray-400">
              Event tickets will appear here after bookings
            </p>
          </CardContent>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tickets match your search</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket: any) => (
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
                {/* User Info */}
                {ticket.user && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">
                          {ticket.user.fullname}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ticket.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Info */}
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
                  onClick={() => handleDownload(ticket.url, ticket.id)}
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
