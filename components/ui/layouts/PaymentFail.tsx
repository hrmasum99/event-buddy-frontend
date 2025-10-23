"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  XCircle,
  Loader2,
  Home,
  RefreshCw,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import { useQueryTransactionQuery } from "@/redux/services/paymentApi";
import { toast } from "sonner";

export default function PaymentFail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  const { data: transactionData, isLoading } = useQueryTransactionQuery(
    { transactionId: tranId || "" },
    { skip: !tranId }
  );

  useEffect(() => {
    if (!tranId) {
      toast.error("Transaction ID not found");
      router.push("/");
    }
  }, [tranId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

  const payment = transactionData?.data;
  const bookingId = payment?.bookingId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Failure Icon */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-red-500 rounded-full mb-4">
            <XCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600">
            Unfortunately, your payment could not be processed
          </p>
        </div>

        {/* Failure Details Card */}
        <Card className="shadow-2xl mb-6">
          <CardContent className="p-6 md:p-8">
            {/* Transaction Info */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">
                    Payment Not Completed
                  </h3>
                  <p className="text-sm text-red-700">
                    Your payment was not successful. This could be due to
                    insufficient funds, incorrect card details, or a network
                    issue.
                  </p>
                </div>
              </div>
            </div>

            {tranId && (
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono font-medium text-gray-900">
                    {tranId}
                  </span>
                </div>
              </div>
            )}

            {/* What Happened */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                What happened?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Your booking is still reserved in your cart</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>No charges were made to your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>
                    You have 24 hours from booking to complete the payment
                  </span>
                </li>
              </ul>
            </div>

            {/* Next Steps Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-sm text-blue-900">
                <strong>Next Steps:</strong> Please check your payment details
                and try again. If the problem persists, contact your bank or try
                a different payment method.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bookingId && (
            <Button
              className="h-12 bg-[#4157FE] hover:bg-[#7B8BFF]"
              onClick={() => router.push(`/payments/do-payment/${bookingId}`)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}

          <Button
            variant="outline"
            className="h-12"
            onClick={() => router.push("/accounts?tab=cart")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Cart
          </Button>

          <Button
            variant="outline"
            className="h-12"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help? Contact our support team
          </p>
          <p className="text-sm text-gray-500">
            Email: support@eventbuddy.com | Phone: +880 1234-567890
          </p>
        </div>
      </div>
    </div>
  );
}
