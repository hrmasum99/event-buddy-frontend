// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   ShoppingCart,
//   Loader2,
//   AlertCircle,
//   Ticket,
//   Calendar,
//   MapPin,
//   Clock as ClockIcon,
//   Trash2,
//   CreditCard,
//   Timer,
// } from "lucide-react";
// import {
//   useGetMyBookingsQuery,
//   useCancelBookingMutation,
// } from "@/redux/services/bookingApi";
// import { toast } from "sonner";
// import Image from "next/image";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// // Timer component for countdown
// function BookingTimer({
//   createdAt,
//   onExpire,
// }: {
//   createdAt: string;
//   onExpire: () => void;
// }) {
//   const [timeLeft, setTimeLeft] = useState("");
//   const [isExpired, setIsExpired] = useState(false);

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const created = new Date(createdAt).getTime();
//       const now = new Date().getTime();
//       const expiry = created + 24 * 60 * 60 * 1000; // 24 hours
//       const remaining = expiry - now;

//       if (remaining <= 0) {
//         setIsExpired(true);
//         onExpire();
//         return "Expired";
//       }

//       const hours = Math.floor(remaining / (1000 * 60 * 60));
//       const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

//       return `${hours}h ${minutes}m ${seconds}s`;
//     };

//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     setTimeLeft(calculateTimeLeft());

//     return () => clearInterval(timer);
//   }, [createdAt, onExpire]);

//   return (
//     <div
//       className={`flex items-center gap-2 ${
//         isExpired ? "text-red-600" : "text-orange-600"
//       }`}
//     >
//       <Timer className="w-4 h-4" />
//       <span className="text-sm font-semibold">
//         {isExpired ? "Expired" : timeLeft}
//       </span>
//     </div>
//   );
// }

// export default function Cart() {
//   const router = useRouter();
//   const { data: bookingsData, isLoading, refetch } = useGetMyBookingsQuery();
//   const [cancelBooking, { isLoading: isCancelling }] =
//     useCancelBookingMutation();
//   const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
//     null
//   );

//   const pendingBookings =
//     bookingsData?.data?.filter((b: any) => b.status === "PENDING") || [];

//   const handleRemoveBooking = async (bookingId: number) => {
//     try {
//       await cancelBooking(bookingId).unwrap();
//       toast.success("Booking removed from cart");
//       refetch();
//     } catch (error: any) {
//       const errorMessage = error?.data?.message || "Failed to remove booking";
//       toast.error(errorMessage);
//     } finally {
//       setSelectedBookingId(null);
//     }
//   };

//   const handleProceedToPayment = (bookingId: number) => {
//     router.push(`/payments/do-payment/${bookingId}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-[#4157FE] mx-auto mb-4" />
//           <p className="text-[#8570AD]">Loading your cart...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center gap-3 mb-2">
//             <ShoppingCart className="w-8 h-8 text-[#4157FE]" />
//             <h1 className="text-3xl font-bold text-[#242565]">Your Cart</h1>
//             {pendingBookings.length > 0 && (
//               <Badge className="bg-[#4157FE] text-white">
//                 {pendingBookings.length}{" "}
//                 {pendingBookings.length === 1 ? "item" : "items"}
//               </Badge>
//             )}
//           </div>
//           <p className="text-[#8570AD]">
//             Complete payment within 24 hours to confirm your bookings
//           </p>
//         </div>

//         {/* Empty Cart */}
//         {pendingBookings.length === 0 ? (
//           <Card className="shadow-lg">
//             <CardContent className="py-16 text-center">
//               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <ShoppingCart className="w-12 h-12 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-[#242565] mb-2">
//                 Your cart is empty
//               </h3>
//               <p className="text-[#8570AD] mb-6">
//                 Add some events to your cart to get started!
//               </p>
//               <Button
//                 onClick={() => router.push("/")}
//                 className="bg-[#4157FE] hover:bg-[#7B8BFF]"
//               >
//                 Browse Events
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="space-y-6">
//             {/* Important Notice */}
//             <Alert className="border-orange-200 bg-orange-50">
//               <AlertCircle className="h-4 w-4 text-orange-600" />
//               <AlertDescription className="text-orange-800">
//                 <strong>Important:</strong> Bookings will expire after 24 hours
//                 if payment is not completed. Please complete your payment to
//                 confirm your seats.
//               </AlertDescription>
//             </Alert>

//             {/* Booking Cards */}
//             {pendingBookings.map((booking: any) => {
//               const event = booking.event;
//               const eventDate = new Date(event.date);
//               const unitPrice = Number(event.ticketPrice) || 0;
//               const quantity = booking.quantity || 0;
//               const total = unitPrice * quantity;

//               return (
//                 <Card
//                   key={booking.id}
//                   className="shadow-lg hover:shadow-xl transition-shadow"
//                 >
//                   <CardContent className="p-6">
//                     <div className="flex flex-col lg:flex-row gap-6">
//                       {/* Event Image */}
//                       {event.imageUrl && (
//                         <div className="w-full lg:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
//                           <Image
//                             src={event.imageUrl}
//                             alt={event.title}
//                             width={192}
//                             height={192}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       )}

//                       {/* Event Details */}
//                       <div className="flex-1 space-y-4">
//                         <div>
//                           <div className="flex items-start justify-between gap-4 mb-2">
//                             <h3 className="text-xl font-bold text-[#242565]">
//                               {event.title}
//                             </h3>
//                             <Badge
//                               variant="outline"
//                               className="bg-yellow-100 text-yellow-800 border-yellow-300"
//                             >
//                               PENDING
//                             </Badge>
//                           </div>

//                           {/* Timer */}
//                           <BookingTimer
//                             createdAt={booking.createdAt}
//                             onExpire={() => {
//                               toast.error(
//                                 `Booking for "${event.title}" has expired`
//                               );
//                               refetch();
//                             }}
//                           />
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#8570AD]">
//                           <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4" />
//                             {eventDate.toLocaleDateString("en-US", {
//                               weekday: "long",
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                             })}
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <ClockIcon className="w-4 h-4" />
//                             {eventDate.toLocaleTimeString("en-US", {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <MapPin className="w-4 h-4" />
//                             {event.location}
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Ticket className="w-4 h-4" />
//                             {quantity} Seat{quantity > 1 ? "s" : ""}
//                           </div>
//                         </div>

//                         <Separator />

//                         {/* Price Details */}
//                         <div className="space-y-2">
//                           <div className="flex justify-between text-sm">
//                             <span className="text-[#8570AD]">
//                               Price per seat
//                             </span>
//                             <span className="font-medium text-[#242565]">
//                               ৳{unitPrice.toFixed(2)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span className="text-[#8570AD]">Quantity</span>
//                             <span className="font-medium text-[#242565]">
//                               ×{quantity}
//                             </span>
//                           </div>
//                           <Separator />
//                           <div className="flex justify-between text-lg font-bold">
//                             <span className="text-[#242565]">Total</span>
//                             <span className="text-[#4157FE]">
//                               ৳{total.toFixed(2)}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex flex-col sm:flex-row gap-3">
//                           <Button
//                             onClick={() => handleProceedToPayment(booking.id)}
//                             className="flex-1 bg-[#4157FE] hover:bg-[#7B8BFF] h-11"
//                           >
//                             <CreditCard className="w-4 h-4 mr-2" />
//                             Proceed to Payment
//                           </Button>

//                           <AlertDialog
//                             open={selectedBookingId === booking.id}
//                             onOpenChange={(open) =>
//                               setSelectedBookingId(open ? booking.id : null)
//                             }
//                           >
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 className="sm:w-auto border-red-200 text-red-600 hover:bg-red-50"
//                               >
//                                 <Trash2 className="w-4 h-4 mr-2" />
//                                 Remove
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>
//                                   Remove from Cart
//                                 </AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to remove "{event.title}
//                                   " from your cart? This will cancel your
//                                   booking and release the reserved seats.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>
//                                   Keep in Cart
//                                 </AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() =>
//                                     handleRemoveBooking(booking.id)
//                                   }
//                                   disabled={isCancelling}
//                                   className="bg-red-600 hover:bg-red-700"
//                                 >
//                                   {isCancelling ? (
//                                     <>
//                                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                       Removing...
//                                     </>
//                                   ) : (
//                                     "Yes, Remove"
//                                   )}
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
