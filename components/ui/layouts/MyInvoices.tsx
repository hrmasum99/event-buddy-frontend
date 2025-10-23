"use client";

import { useGetMyInvoicesQuery } from "@/redux/services/bookingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, DollarSign, Receipt } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MyInvoices() {
  const { data: invoicesResponse, isLoading, error } = useGetMyInvoicesQuery();

  const invoices = invoicesResponse?.data || [];

  const handleDownload = async (url: string, invoiceId: number) => {
    try {
      // Open in new tab for download
      window.open(url, "_blank");
      toast.success("Invoice download started!");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#242565]">My Invoices</h2>
          <p className="text-sm text-gray-600 mt-1">Loading your invoices...</p>
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
          <h2 className="text-xl font-semibold text-[#242565]">My Invoices</h2>
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-[#242565]">My Invoices</h2>
          <p className="text-sm text-gray-600 mt-1">
            View and download your payment invoices
          </p>
        </div>
        {invoices.length > 0 && (
          <span className="text-sm text-gray-500">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No invoices found</p>
            <p className="text-sm text-gray-400">
              Your payment invoices will appear here after successful
              transactions
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((invoice: any) => (
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
                {invoice.payment && (
                  <>
                    <div>
                      <p className="font-medium text-[#242565]">
                        {invoice.payment.eventTitle || "Event Payment"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Transaction ID: {invoice.payment.tranId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">
                        ৳{parseFloat(invoice.payment.amount || "0").toFixed(2)}
                      </span>
                      <span className="text-xs">
                        ({invoice.payment.quantity} ticket
                        {invoice.payment.quantity !== 1 ? "s" : ""})
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Payment Method: {invoice.payment.method || "N/A"}
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
