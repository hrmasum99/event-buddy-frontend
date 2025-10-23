"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Loader2,
  Download,
  Calendar,
  MapPin,
  Ticket,
  Home,
  FileText,
  X,
} from "lucide-react";
import { useQueryTransactionQuery } from "@/redux/services/paymentApi";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  const {
    data: transactionData,
    isLoading,
    error,
  } = useQueryTransactionQuery(
    { transactionId: tranId || "" },
    { skip: !tranId }
  );

  useEffect(() => {
    if (!tranId) {
      toast.error("Transaction ID not found");
      router.push("/");
    }
  }, [tranId, router]);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !transactionData?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please contact support.
            </p>
            <Button onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const payment = transactionData.data;
  // const event = payment.booking?.event;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 relative overflow-hidden">
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} />
      )}

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-500 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your booking has been confirmed
          </p>
        </div>

        {/* Payment Details Card */}
        <Card className="shadow-2xl mb-6">
          <CardContent className="p-6 md:p-8">
            {/* Transaction Info */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Transaction ID</span>
                <span className="font-mono font-semibold text-green-700">
                  {payment.sslcommerz.tran_id}
                </span>
              </div>
              {payment.sslcommerz.val_id && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Validation ID</span>
                  <span className="font-mono text-sm text-gray-700">
                    {payment.sslcommerz.val_id}
                  </span>
                </div>
              )}
            </div>

            {/* Event Details */}
            {payment.event && (
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-bold text-[#242565] flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-[#4157FE]" />
                  {payment.event.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(
                        new Date(payment.event.date),
                        "MMM dd, yyyy 'at' hh:mm a"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">
                      {payment.event.location}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Payment Summary */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Payment Summary</h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket Price</span>
                  <span className="font-medium">
                    {payment.booking.unitPrice}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">
                    {payment.booking.numSeats}
                  </span>
                </div>

                {/* {payment.couponCode && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coupon Applied</span>
                      <span className="font-medium text-green-600">
                        {payment.couponCode}
                      </span>
                    </div>
                    {payment.couponDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-৳{payment.couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )} */}

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">
                    {payment.sslcommerz.bank_gw}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-green-600">
                    ৳{parseFloat(payment.sslcommerz.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Booking Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{payment.biller.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{payment.biller.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date</span>
                  <span className="font-medium">
                    {format(
                      new Date(payment.sslcommerz.tran_date),
                      "MMM dd, yyyy 'at' hh:mm a"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-12"
            onClick={() => router.push("/accounts?tab=tickets")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Ticket
          </Button>

          <Button
            variant="outline"
            className="h-12"
            onClick={() => router.push("/accounts?tab=invoices")}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Invoice
          </Button>

          <Button
            className="h-12 bg-[#4157FE] hover:bg-[#7B8BFF]"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Browse More Events
          </Button>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            A confirmation email with your ticket and invoice has been sent to{" "}
            <span className="font-semibold">{payment.biller.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
