"use client";

import { useAuth } from "@/redux/customHooks";
import { useGetMyBookingsQuery } from "@/redux/services/bookingApi";
import {
  useGetMyPaymentsQuery,
  useGetAllPaymentsQuery,
} from "@/redux/services/paymentApi";
import { useGetAllEventsQuery } from "@/redux/services/eventApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Shield,
  TrendingUp,
  DollarSign,
  Calendar,
  XCircle,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4157FE", "#7B8BFF", "#FF6B6B", "#4ECDC4", "#FFE66D"];

export default function AccountOverview() {
  const { user } = useAuth();
  const { data: bookingsResponse } = useGetMyBookingsQuery();
  const { data: myPaymentsResponse } = useGetMyPaymentsQuery();
  const { data: allPaymentsResponse } = useGetAllPaymentsQuery(undefined, {
    skip: user?.role !== "admin",
  });
  const { data: eventsResponse } = useGetAllEventsQuery(
    { page: 1, limit: 100 },
    { skip: user?.role !== "admin" }
  );

  const bookings = bookingsResponse?.data || [];
  const myPayments = myPaymentsResponse?.data || [];
  const allPayments = allPaymentsResponse?.data || [];
  const events = eventsResponse?.data || [];

  // Calculate stats for users
  const calculateUserStats = () => {
    // Use payment data for accurate financial information
    const successfulPayments = myPayments.filter((p) => p.status === "SUCCESS");
    const totalSpent = successfulPayments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount || "0"),
      0
    );

    const totalEvents = bookings.length;

    // Group bookings by event for chart
    const eventCounts: Record<string, number> = {};
    bookings.forEach((booking) => {
      const eventTitle = booking.event?.title || "Unknown Event";
      eventCounts[eventTitle] = (eventCounts[eventTitle] || 0) + 1;
    });

    const eventData = Object.entries(eventCounts)
      .map(([title, count]) => ({
        name: title.length > 20 ? title.substring(0, 20) + "..." : title,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Spending by event using payment data
    const spendingByEvent: Record<string, number> = {};
    successfulPayments.forEach((payment) => {
      const eventTitle = payment.eventTitle || "Unknown Event";
      spendingByEvent[eventTitle] =
        (spendingByEvent[eventTitle] || 0) + parseFloat(payment.amount || "0");
    });

    const spendingData = Object.entries(spendingByEvent)
      .map(([title, amount]) => ({
        name: title.length > 20 ? title.substring(0, 20) + "..." : title,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Calculate booking rates from payments
    const cancelledPayments = myPayments.filter(
      (p) => p.status === "CANCELLED" || p.status === "REFUNDED"
    ).length;
    const confirmedPayments = successfulPayments.length;
    const totalPayments = myPayments.length;

    return {
      totalSpent,
      totalEvents,
      cancelledBookings: cancelledPayments,
      confirmedBookings: confirmedPayments,
      cancelRate:
        totalPayments > 0
          ? ((cancelledPayments / totalPayments) * 100).toFixed(1)
          : "0",
      confirmRate:
        totalPayments > 0
          ? ((confirmedPayments / totalPayments) * 100).toFixed(1)
          : "0",
      eventData,
      spendingData,
    };
  };

  // Calculate stats for admins
  const calculateAdminStats = () => {
    const successfulPayments = allPayments.filter(
      (p) => p.status === "SUCCESS"
    );
    const totalRevenue = successfulPayments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount || "0"),
      0
    );

    const totalTicketsSold = successfulPayments.reduce(
      (sum, payment) => sum + (payment.quantity || 0),
      0
    );

    // Calculate cancellation stats
    const cancelledPayments = allPayments.filter(
      (p) => p.status === "CANCELLED" || p.status === "REFUNDED"
    );
    const totalCancelled = cancelledPayments.reduce(
      (sum, payment) => sum + (payment.quantity || 0),
      0
    );
    const totalConfirmed = totalTicketsSold;

    // Tickets sold by event
    const eventTickets: Record<string, number> = {};
    successfulPayments.forEach((payment) => {
      const eventTitle = payment.eventTitle || "Unknown Event";
      eventTickets[eventTitle] =
        (eventTickets[eventTitle] || 0) + (payment.quantity || 0);
    });

    const ticketData = Object.entries(eventTickets)
      .map(([title, count]) => ({
        name: title.length > 20 ? title.substring(0, 20) + "..." : title,
        tickets: count,
      }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 10);

    // Revenue by event
    const eventRevenue: Record<string, number> = {};
    successfulPayments.forEach((payment) => {
      const eventTitle = payment.eventTitle || "Unknown Event";
      eventRevenue[eventTitle] =
        (eventRevenue[eventTitle] || 0) + parseFloat(payment.amount || "0");
    });

    const revenueData = Object.entries(eventRevenue)
      .map(([title, amount]) => ({
        name: title.length > 20 ? title.substring(0, 20) + "..." : title,
        revenue: amount,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get cancellation reasons from events with bookings
    const cancellationReasons: Record<string, number> = {};
    events.forEach((event) => {
      const eventBookings = event.cancellationReason || [];
      eventBookings.forEach((booking: any) => {
        if (
          booking.bookingStatus === "cancelled" &&
          booking.cancellationReason
        ) {
          const reason = booking.cancellationReason || "No reason provided";
          cancellationReasons[reason] = (cancellationReasons[reason] || 0) + 1;
        }
      });
    });

    const cancellationData = Object.entries(cancellationReasons)
      .map(([reason, count]) => ({
        name: reason.length > 30 ? reason.substring(0, 30) + "..." : reason,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);

    const totalAllTickets = totalTicketsSold + totalCancelled;

    return {
      totalRevenue,
      totalTicketsSold,
      totalCancelled,
      totalConfirmed,
      cancelRate:
        totalAllTickets > 0
          ? ((totalCancelled / totalAllTickets) * 100).toFixed(1)
          : "0",
      confirmRate:
        totalAllTickets > 0
          ? ((totalTicketsSold / totalAllTickets) * 100).toFixed(1)
          : "0",
      ticketData,
      revenueData,
      cancellationData,
    };
  };

  const isAdmin = user?.role === "admin";
  const userStats = !isAdmin ? calculateUserStats() : null;
  const adminStats = isAdmin ? calculateAdminStats() : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#242565]">
          Account Overview
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Your account statistics and activity summary
        </p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user?.fullname || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium capitalize">{user?.role || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid - USER */}
      {!isAdmin && userStats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Events</p>
                    <p className="text-2xl font-bold text-[#242565]">
                      {userStats.totalEvents}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-[#4157FE]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold text-[#242565]">
                      ৳{userStats.totalSpent.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Confirmed</p>
                    <p className="text-2xl font-bold text-[#242565]">
                      {userStats.confirmRate}%
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-2xl font-bold text-[#242565]">
                      {userStats.cancelRate}%
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Events Attended</CardTitle>
              </CardHeader>
              <CardContent>
                {userStats.eventData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userStats.eventData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4157FE" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">
                    No event data available
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Spending by Event</CardTitle>
              </CardHeader>
              <CardContent>
                {userStats.spendingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userStats.spendingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#7B8BFF" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">
                    No spending data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Stats Grid - ADMIN */}
      {isAdmin && adminStats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Tickets Sold</p>
                    <p className="text-2xl font-bold text-[#242565]">
                      {adminStats.totalTicketsSold}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[#4157FE]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#242565]">
                      ৳{adminStats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Confirm Rate</p>
                    <p className="text-2xl font-bold text-[#242565]">
                      {adminStats.confirmRate}%
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Cancel Rate</p>
                    <p className="text-2xl font-bold text-[#242565]">
                      {adminStats.cancelRate}%
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Tickets Sold by Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adminStats.ticketData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={adminStats.ticketData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tickets" fill="#4157FE" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">
                    No ticket data available
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue by Event</CardTitle>
              </CardHeader>
              <CardContent>
                {adminStats.revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={adminStats.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#7B8BFF" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">
                    No revenue data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {adminStats.cancellationData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Cancellation Reasons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={adminStats.cancellationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {adminStats.cancellationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// export default function AccountSummary() {
//   return (
//     <>
//       <h1>Account Summary</h1>
//     </>
//   );
// }
