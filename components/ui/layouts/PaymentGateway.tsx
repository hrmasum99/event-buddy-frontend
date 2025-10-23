// "use client";

// import { useEffect, useState, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   CheckCircle2,
//   CreditCard,
//   Loader2,
//   AlertCircle,
//   Ticket,
//   Calendar,
//   MapPin,
//   Users,
//   Tag,
//   ArrowLeft,
//   ShieldCheck,
// } from "lucide-react";
// import { useGetEventByIdQuery } from "@/redux/services/eventApi";
// import { useInitiatePaymentMutation } from "@/redux/services/paymentApi";
// import { toast } from "sonner";
// import Image from "next/image";

// function PaymentGateway() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const bookingId = searchParams?.get("bookingId");
//   const eventId = searchParams?.get("eventId");

//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
//   const [discount, setDiscount] = useState(0);

//   const { data: eventData, isLoading: isLoadingEvent } = useGetEventByIdQuery(
//     Number(eventId),
//     { skip: !eventId }
//   );

//   const [initiatePayment, { isLoading: isInitiating }] =
//     useInitiatePaymentMutation();

//   const event = eventData;

//   useEffect(() => {
//     if (!bookingId || !eventId) {
//       toast.error("Invalid payment request");
//       router.push("/");
//     }
//   }, [bookingId, eventId, router]);

//   const handleApplyCoupon = () => {
//     if (!couponCode.trim()) {
//       toast.error("Please enter a coupon code");
//       return;
//     }

//     // Mock coupon validation - replace with actual API call
//     if (couponCode.toUpperCase() === "DISCOUNT10") {
//       setAppliedCoupon(couponCode);
//       setDiscount(10);
//       toast.success("Coupon applied! You got 10% discount");
//     } else {
//       toast.error("Invalid coupon code");
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setDiscount(0);
//     setCouponCode("");
//     toast.info("Coupon removed");
//   };

//   const handleProceedToPayment = async () => {
//     if (!bookingId || !event) {
//       toast.error("Booking information missing");
//       return;
//     }

//     try {
//       const result = await initiatePayment({
//         bookingId: Number(bookingId),
//         couponCode: appliedCoupon || undefined,
//         // method: "SSLCommerz",
//       }).unwrap();

//       if (result?.data?.gatewayUrl) {
//         toast.success("Redirecting to payment gateway...");
//         // Redirect to SSLCommerz payment gateway
//         window.location.href = result.data.gatewayUrl;
//       } else {
//         toast.error("Failed to initiate payment");
//       }
//     } catch (error: any) {
//       console.error("Payment initiation error:", error);
//       const errorMessage =
//         error?.data?.message || "Failed to initiate payment. Please try again.";
//       toast.error(errorMessage);
//     }
//   };

//   if (isLoadingEvent) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-[#4157FE] mx-auto mb-4" />
//           <p className="text-[#8570AD]">Loading payment details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Card className="w-full max-w-md">
//           <CardContent className="pt-6">
//             <Alert className="border-red-200 bg-red-50">
//               <AlertCircle className="h-4 w-4 text-red-600" />
//               <AlertDescription className="text-red-800">
//                 Event not found. Please try again.
//               </AlertDescription>
//             </Alert>
//             <Button
//               onClick={() => router.push("/")}
//               className="w-full mt-4 bg-[#4157FE] hover:bg-[#7B8BFF]"
//             >
//               Back to Events
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const ticketPrice = Number(event.ticketPrice) || 0;
//   const quantity = Number(searchParams?.get("quantity")) || 1;
//   const subtotal = ticketPrice * quantity;
//   const discountAmount = (subtotal * discount) / 100;
//   const total = subtotal - discountAmount;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <Button
//             variant="ghost"
//             onClick={() => router.back()}
//             className="mb-4"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Event
//           </Button>
//           <h1 className="text-3xl font-bold text-[#242565]">
//             Complete Payment
//           </h1>
//           <p className="text-[#8570AD] mt-2">
//             Review your booking and complete the payment
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Event Details & Coupon */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Event Summary Card */}
//             <Card className="shadow-lg">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-[#242565]">
//                   <Ticket className="w-5 h-5 text-[#4157FE]" />
//                   Event Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex gap-4">
//                   {event.imageUrl && (
//                     <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
//                       <Image
//                         src={event.imageUrl}
//                         alt={event.title}
//                         width={128}
//                         height={128}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <div className="flex-1 space-y-3">
//                     <h3 className="text-xl font-semibold text-[#242565]">
//                       {event.title}
//                     </h3>

//                     <div className="space-y-2 text-sm text-[#8570AD]">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="w-4 h-4" />
//                         {new Date(event.date).toLocaleDateString("en-US", {
//                           weekday: "long",
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <MapPin className="w-4 h-4" />
//                         {event.location}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Users className="w-4 h-4" />
//                         {quantity} Seat{quantity > 1 ? "s" : ""}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Coupon Card */}
//             <Card className="shadow-lg">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-[#242565]">
//                   <Tag className="w-5 h-5 text-[#4157FE]" />
//                   Apply Coupon
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {appliedCoupon ? (
//                   <Alert className="border-green-200 bg-green-50">
//                     <CheckCircle2 className="h-4 w-4 text-green-600" />
//                     <AlertDescription className="text-green-800 flex items-center justify-between">
//                       <span>
//                         Coupon <strong>{appliedCoupon}</strong> applied! You
//                         saved {discount}%
//                       </span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={handleRemoveCoupon}
//                         className="text-green-800 hover:text-green-900"
//                       >
//                         Remove
//                       </Button>
//                     </AlertDescription>
//                   </Alert>
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Enter coupon code"
//                         value={couponCode}
//                         onChange={(e) =>
//                           setCouponCode(e.target.value.toUpperCase())
//                         }
//                         className="flex-1"
//                       />
//                       <Button
//                         onClick={handleApplyCoupon}
//                         variant="outline"
//                         className="whitespace-nowrap"
//                       >
//                         Apply
//                       </Button>
//                     </div>
//                     <p className="text-xs text-[#8570AD]">
//                       Have a discount code? Enter it above to save on your
//                       booking!
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Security Note */}
//             <Alert className="border-blue-200 bg-blue-50">
//               <ShieldCheck className="h-4 w-4 text-blue-600" />
//               <AlertDescription className="text-blue-800">
//                 <strong>Secure Payment:</strong> Your payment is processed
//                 through SSLCommerz, a secure and trusted payment gateway in
//                 Bangladesh.
//               </AlertDescription>
//             </Alert>
//           </div>

//           {/* Right Column - Payment Summary */}
//           <div className="lg:col-span-1">
//             <Card className="shadow-lg sticky top-6">
//               <CardHeader>
//                 <CardTitle className="text-[#242565]">
//                   Payment Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-[#8570AD]">Ticket Price</span>
//                     <span className="font-medium text-[#242565]">
//                       ৳{ticketPrice.toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-[#8570AD]">Quantity</span>
//                     <span className="font-medium text-[#242565]">
//                       ×{quantity}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-[#8570AD]">Subtotal</span>
//                     <span className="font-medium text-[#242565]">
//                       ৳{subtotal.toFixed(2)}
//                     </span>
//                   </div>

//                   {discount > 0 && (
//                     <>
//                       <Separator />
//                       <div className="flex justify-between text-sm text-green-600">
//                         <span>Discount ({discount}%)</span>
//                         <span className="font-medium">
//                           -৳{discountAmount.toFixed(2)}
//                         </span>
//                       </div>
//                     </>
//                   )}

//                   <Separator />

//                   <div className="flex justify-between text-lg font-bold">
//                     <span className="text-[#242565]">Total</span>
//                     <span className="text-[#4157FE]">৳{total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 text-xs text-[#8570AD]">
//                     <CheckCircle2 className="w-4 h-4 text-green-600" />
//                     <span>Instant booking confirmation</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs text-[#8570AD]">
//                     <CheckCircle2 className="w-4 h-4 text-green-600" />
//                     <span>E-ticket sent to your email</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs text-[#8570AD]">
//                     <CheckCircle2 className="w-4 h-4 text-green-600" />
//                     <span>Refund available (conditions apply)</span>
//                   </div>
//                 </div>

//                 <Button
//                   onClick={handleProceedToPayment}
//                   disabled={isInitiating}
//                   className="w-full bg-[#4157FE] hover:bg-[#7B8BFF] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
//                 >
//                   {isInitiating ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <CreditCard className="w-4 h-4 mr-2" />
//                       Proceed to Payment
//                     </>
//                   )}
//                 </Button>

//                 <p className="text-xs text-center text-[#8570AD]">
//                   By continuing, you agree to our{" "}
//                   <a href="#" className="text-[#4157FE] underline">
//                     Terms & Conditions
//                   </a>
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function PaymentPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center">
//           <Loader2 className="w-12 h-12 animate-spin text-[#4157FE]" />
//         </div>
//       }
//     >
//       <PaymentGateway />
//     </Suspense>
//   );
// }
