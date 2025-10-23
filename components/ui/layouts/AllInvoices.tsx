"use client";

import { useState } from "react";
import { useGetAllInvoicesQuery } from "@/redux/services/bookingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  FileText,
  DollarSign,
  Receipt,
  Search,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AllInvoices() {
  const { data: invoicesResponse, isLoading, error } = useGetAllInvoicesQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = invoicesResponse?.data || [];

  // Filter invoices based on search
  const filteredInvoices = invoices.filter((invoice: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      invoice.id.toString().includes(searchLower) ||
      invoice.payment?.eventTitle?.toLowerCase().includes(searchLower) ||
      invoice.payment?.tranId?.toLowerCase().includes(searchLower) ||
      invoice.user?.fullname?.toLowerCase().includes(searchLower) ||
      invoice.user?.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleDownload = async (url: string, invoiceId: number) => {
    try {
      window.open(url, "_blank");
      toast.success("Invoice download started!");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  // Calculate total revenue
  const totalRevenue = invoices.reduce((sum: number, invoice: any) => {
    return sum + parseFloat(invoice.payment?.amount || "0");
  }, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#242565]">All Invoices</h2>
          <p className="text-sm text-gray-600 mt-1">Loading all invoices...</p>
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
          <h2 className="text-xl font-semibold text-[#242565]">All Invoices</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500 text-center">
              Failed to load invoices. Please try again.
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
          <h2 className="text-xl font-semibold text-[#242565]">All Invoices</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage all payment invoices in the system
          </p>
        </div>
        {invoices.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {filteredInvoices.length} of {invoices.length} invoice
              {invoices.length !== 1 ? "s" : ""}
            </p>
            <p className="text-lg font-semibold text-green-600">
              Total: ৳{totalRevenue.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by invoice ID, event, transaction ID, user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No invoices found</p>
            <p className="text-sm text-gray-400">
              Payment invoices will appear here after transactions
            </p>
          </CardContent>
        </Card>
      ) : filteredInvoices.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No invoices match your search</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInvoices.map((invoice: any) => (
            <Card
              key={invoice.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#4157FE]" />
                    <CardTitle className="text-base">
                      Invoice #{invoice.id}
                    </CardTitle>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Paid
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* User Info */}
                {invoice.user && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">
                          {invoice.user.fullname}
                        </p>
                        <p className="text-xs text-gray-500">
                          {invoice.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                {invoice.payment && (
                  <>
                    <div>
                      <p className="font-medium text-[#242565]">
                        {invoice.payment.eventTitle || "Event Payment"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Txn: {invoice.payment.tranId}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-green-600">
                          ৳
                          {parseFloat(invoice.payment.amount || "0").toFixed(2)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {invoice.payment.quantity} ticket
                        {invoice.payment.quantity !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Method: {invoice.payment.method || "N/A"}</span>
                      <span className="capitalize">
                        {invoice.payment.status}
                      </span>
                    </div>
                  </>
                )}

                <div className="text-xs text-gray-500 pt-2 border-t">
                  Issued: {format(new Date(invoice.createdAt), "MMM dd, yyyy")}
                </div>

                <Button
                  onClick={() => handleDownload(invoice.url, invoice.id)}
                  className="w-full bg-[#4157FE] hover:bg-[#3646D5]"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
