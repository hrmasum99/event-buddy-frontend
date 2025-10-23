interface ApiSuccessResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  errors: null;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
  data: null;
  errors: {
    field: string;
    error: string;
  }[];
}

interface RtkQueryError {
  status: number;
  data: ApiErrorResponse;
}

interface IPaginationData<TData> {
  meta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    items_per_page: number;
  };
  success: boolean;
  message: string;
  data: TData[];
}

type IAuth = {
  user: IUser;
  access_token: string;
  twoFactorRequired: boolean;
};

type IUser = {
  id: number;
  email: string;
  fullname: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  isTwoFactorEnabled: boolean;
};

type IEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  tags: string;
  imageUrl: string;
  imagePublicId: string;
  ticketPrice: string;
  cancellationReason: IRefund[];
};

type IBooking = {
  id: number;
  seatsBooked: number;
  userId?: number;
  eventId?: number;
  event: IEvent;
  status: "PENDING" | "ACTIVE" | "CANCELLED";
  unitPrice: string;
  quantity: number;
  totalPaid: string;
  payment: IPayment;
  couponCode?: string;
  couponDiscount?: number;
  createdAt: Date;
};

type ISeatInfo = {
  eventId: number;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
};

type IPayment = {
  id: number;
  eventTitle: string;
  quantity: number;
  amount: string;
  tranId: string;
  valId?: string;
  currency: string;
  gateway?: string;
  method?: string;
  cusName: string;
  cusEmail: string;
  couponCode?: string | null;
  couponDiscount?: number | null;
  status: "INITIATED" | "CANCELLED" | "SUCCESS" | "FAILED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;

  userId?: number;
  eventId?: number;
};

type IRefund = {
  id: number;
  refundRefId: string;
  userId: number;
  reason: CancelReasonEnum;
  status: "PENDING" | "APPROVED" | "REJECTED";
  cancel_logs?: string;
  amount: number;
  adminId?: number;
  adminName?: string;
  adminEmail?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  paymentId?: number;
  bookingId?: number;
  userId?: number;
};

type IDocument = {
  id: number;
  userId: number;
  eventId: number;
  type: "TICKET" | "INVOICE";
  url: string;
  createdAt: string;
  paymentId?: number;
};

type ICoupon = {
  id: number;
  code: string;
  title: string;
  discountPercent: number;
  validFrom: string;
  validTo: string;
  active: boolean;
  eventId: number;
};

type ITicket = {
  id: number;
  url: string;
  userId: number;
  eventId: number;
  createdAt: string;
};

type ICancelLog = {
  id: number;
  userId: number;
  bookingId: number;
  reason: CancelReasonEnum;
  refundEligible: boolean;
  refund?: IRefund;
  createdAt: string;
};

type IInvoice = {
  id: number;
  url: string;
  userId: number;
  paymentId: number;
  createdAt: string;
};

enum CancelReasonEnum {
  FRAUD_EVENT = "Fraudulent event",
  HIGH_PRICE = "Ticket price too high",
  CHANGE_OF_PLANS = "Change of plans",
  DUPLICATE_BOOKING = "Duplicate booking",
  ILLNESS = "Unable to attend due to illness",
  TRAVEL_ISSUE = "Travel / Transportation issue",
  EVENT_POSTPONED = "Event postponed by organizer",
  PERSONAL_REASONS = "PERSONAL REASONS",
  OTHER = "Other",
}
