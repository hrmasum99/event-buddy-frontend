"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Ticket,
  Calendar,
  MapPin,
  CreditCard,
  Tag,
  CheckCircle,
  X,
} from "lucide-react";
import { useGetBookingByIdQuery } from "@/redux/services/bookingApi";
import { useInitiatePaymentMutation } from "@/redux/services/paymentApi";
import { toast } from "sonner";
import Image from "next/image";
import { format } from "date-fns";

interface PaymentFormProps {
  bookingId: string;
}

export default function PaymentForm({ bookingId }: PaymentFormProps) {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const { data: booking, isLoading, error } = useGetBookingByIdQuery(bookingId);
  const [initiatePayment, { isLoading: isProcessing }] =
    useInitiatePaymentMutation();

  // Check if booking has expired (24 hours)
  const isBookingExpired = () => {
    if (!booking?.createdAt) return false;
    const created = new Date(booking.createdAt).getTime();
    const now = new Date().getTime();
    const expiry = created + 24 * 60 * 60 * 1000;
    return now > expiry;
  };

  // Check if event has passed
  const isEventPassed = () => {
    if (!booking?.event?.date) return false;
    return new Date(booking.event.date).getTime() < new Date().getTime();
  };

  useEffect(() => {
    if (booking) {
      if (isBookingExpired()) {
        toast.error("This booking has expired (24 hours passed)");
        router.push("/accounts?tab=cart");
      } else if (isEventPassed()) {
        toast.error("Event date has already passed");
        router.push("/accounts?tab=cart");
      } else if (booking.status !== "PENDING") {
        toast.error("Only PENDING bookings can initiate payment");
        router.push("/accounts?tab=cart");
      }
    }
  }, [booking, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#4157FE] mx-auto mb-4" />
          <p className="text-[#8570AD]">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Booking Not Found</h3>
              <p className="text-gray-600 mb-4">
                The booking you're looking for doesn't exist or has been
                removed.
              </p>
              <Button onClick={() => router.push("/accounts?tab=cart")}>
                Go to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const event = booking.event;
  const unitPrice = parseFloat(booking.unitPrice) || 0;
  const quantity = booking.quantity || 0;
  const subtotal = unitPrice * quantity;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    // Simulated coupon validation (you should replace this with actual API call)
    const validCoupons: Record<string, number> = {
      SAVE10: 10,
      SAVE20: 20,
      WELCOME15: 15,
    };

    const upperCoupon = couponCode.toUpperCase();
    if (validCoupons[upperCoupon]) {
      setAppliedCoupon(upperCoupon);
      setDiscount(validCoupons[upperCoupon]);
      toast.success(
        `Coupon ${upperCoupon} applied! ${validCoupons[upperCoupon]}% off`
      );
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const parsedBookingId = parseInt(bookingId);

  // Ensure seatsBooked (quantity) and unitPrice are also numbers
  const seatsBookedValue = Number(quantity); // Use Number() or parseFloat()
  const unitPriceValue = Number(unitPrice); // Use Number() or parseFloat()

  const handlePayment = async () => {
    try {
      const result = await initiatePayment({
        bookingId: parsedBookingId, // Must be a number
        eventId: event.id, // Should already be a number if from RTK Query
        seatsBooked: seatsBookedValue, // Must be a number
        unitPrice: unitPriceValue, // Must be a number
        couponCode: appliedCoupon || undefined,
      }).unwrap();

      if (result.success && result.data.gatewayUrl) {
        toast.success("Redirecting to payment gateway...");
        // Redirect to SSLCommerz payment page
        window.location.href = result.data.gatewayUrl;
      } else {
        toast.error(result.message || "Failed to initiate payment");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "An error occurred while processing payment";
      toast.error(errorMessage);
    }
    console.log(bookingId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/accounts?tab=cart")}
            className="mb-4"
          >
            <X className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-[#242565]">
            Complete Payment
          </h1>
          <p className="text-[#8570AD]">
            Review your order and proceed to payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-[#4157FE]" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.imageUrl && (
                  <div className="w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      width={600}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-[#242565] mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-[#8570AD]">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8570AD]">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-medium">#{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Seat</span>
                    <span className="font-medium">৳{unitPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 text-[#4157FE]" />
                  Apply Coupon Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          {appliedCoupon}
                        </p>
                        <p className="text-sm text-green-700">
                          {discount}% discount applied
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900 font-medium mb-1">
                    Available Coupons:
                  </p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• SAVE10 - Get 10% off</li>
                    <li>• SAVE20 - Get 20% off</li>
                    <li>• WELCOME15 - Get 15% off</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#4157FE]" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-৳{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#242565]">Total</span>
                    <span className="text-[#4157FE]">৳{total.toFixed(2)}</span>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    You will be redirected to SSLCommerz payment gateway to
                    complete your payment securely.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handlePayment}
                  disabled={
                    isProcessing || isBookingExpired() || isEventPassed()
                  }
                  className="w-full bg-[#4157FE] hover:bg-[#7B8BFF] h-12 text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Secured by SSLCommerz Payment Gateway
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
