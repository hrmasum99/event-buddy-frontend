// =====================
// # Auth Endpoints
// =====================
export const NEXT_PUBLIC_API_AUTH_SIGNUP = "/auth/signup";
export const NEXT_PUBLIC_API_AUTH_SIGNIN = "/auth/signin";
export const NEXT_PUBLIC_API_AUTH_LOGOUT = "/auth/logout";
export const NEXT_PUBLIC_API_AUTH_FORGOT_PASSWORD = "/auth/forgot-password";
export const NEXT_PUBLIC_API_AUTH_VERIFY_OTP = "/auth/verify-otp";
export const NEXT_PUBLIC_API_AUTH_RESET_PASSWORD = "/auth/reset-password";
export const NEXT_PUBLIC_API_AUTH_CHANGE_PASSWORD = "/auth/change-password";
export const NEXT_PUBLIC_API_AUTH_2FA_ENABLE = "/auth/2fa/setup";
export const NEXT_PUBLIC_API_AUTH_2FA_DISABLE = "/auth/2fa/disable";
export const NEXT_PUBLIC_API_AUTH_2FA_VERIFY = "/auth/2fa/verify";

// =====================
// # User Endpoints
// =====================
export const NEXT_PUBLIC_API_USER_PROFILE = "/user/profile";
export const NEXT_PUBLIC_API_USER_ALL_USERS = "/user/all-users";
export const NEXT_PUBLIC_API_USER_CREATE_EVENT = "/user/create-event";
export const NEXT_PUBLIC_API_USER_UPLOAD_EVENT_IMAGE =
  "/user/upload-event-image/"; // + {id}
export const NEXT_PUBLIC_API_USER_UPDATE_EVENT_IMAGE =
  "/user/update-event-image/"; // + {id}
export const NEXT_PUBLIC_API_USER_UPDATE_EVENT = "/user/update-event/"; // + {id}
export const NEXT_PUBLIC_API_USER_DELETE_EVENT = "/user/delete-event/"; // + {id}

// =====================
// # Event Endpoints
// =====================
export const NEXT_PUBLIC_API_EVENTS = "/events";
export const NEXT_PUBLIC_API_EVENTS_UPCOMING = "/events/upcoming";
export const NEXT_PUBLIC_API_EVENTS_PREVIOUS = "/events/previous";
export const NEXT_PUBLIC_API_EVENTS_DETAIL = "/events/get-event/"; // + {id}
export const NEXT_PUBLIC_API_EVENTS_IMAGE = "/events/image/"; // + {id}
export const NEXT_PUBLIC_API_EVENTS_MY = "/events/my-events";
export const NEXT_PUBLIC_API_EVENTS_CREATE_COUPON = "/events/create-coupon";
export const NEXT_PUBLIC_API_EVENTS_DELETE_COUPON = "/events/delete-coupon/"; // + {id}
export const NEXT_PUBLIC_API_EVENTS_GET_COUPON = "/events/get-coupon/"; // + {id}
export const NEXT_PUBLIC_API_EVENTS_GET_ALL_COUPON = "/events/get-all-coupon";

// =====================
// # Booking Endpoints
// =====================
export const NEXT_PUBLIC_API_BOOKINGS_AVAILABLE_SEATS =
  "/bookings/available-seats/"; // + {id}
export const NEXT_PUBLIC_API_BOOKINGS_DETAIL = "/bookings/get-booking/"; // + {id}
export const NEXT_PUBLIC_API_BOOKINGS_MY = "/bookings/my-bookings";
export const NEXT_PUBLIC_API_BOOKINGS_NEW = "/bookings/new-booking/"; // + {eventId}
export const NEXT_PUBLIC_API_BOOKINGS_CANCEL = "/bookings/cancel-booking/"; // + {id}

// =====================
// # Payment Endpoints
// =====================
export const NEXT_PUBLIC_API_PAYMENTS_INITIATE = "/payments/initiate";
export const NEXT_PUBLIC_API_PAYMENTS_QUERY = "/payments/query-tran";
export const NEXT_PUBLIC_API_PAYMENTS_DETAIL = "/bookings/get-payment/"; // + {id}
export const NEXT_PUBLIC_API_PAYMENTS_MY = "/payments/my-payments";
export const NEXT_PUBLIC_API_PAYMENTS_ALL = "/payments/all"; // Admin only

// =====================
// # Document Endpoints
// =====================
export const NEXT_PUBLIC_API_DOCUMENTS_INVOICE = "/documents/invoice/"; // + {id}
export const NEXT_PUBLIC_API_DOCUMENTS_TICKET = "/documents/ticket/"; // + {id}
export const NEXT_PUBLIC_API_DOCUMENTS_ALL_INVOICES = "/documents/invoices"; // Admin only
export const NEXT_PUBLIC_API_DOCUMENTS_ALL_TICKETS = "/documents/tickets"; // Admin only
export const NEXT_PUBLIC_API_DOCUMENTS_MY_INVOICES = "/documents/my-invoices";
export const NEXT_PUBLIC_API_DOCUMENTS_MY_TICKETS = "/documents/my-tickets";

// =====================
// # Refund Endpoints
// =====================
export const NEXT_PUBLIC_API_REFUNDS = "/refunds"; // with filters
export const NEXT_PUBLIC_API_REFUNDS_ALL = "/refunds/get-all";
export const NEXT_PUBLIC_API_REFUNDS_DETAIL = "/refunds/"; // + {id}
export const NEXT_PUBLIC_API_REFUNDS_APPROVE = "/refunds/approve/"; // + {id}
export const NEXT_PUBLIC_API_REFUNDS_REJECT = "/refunds/reject/"; // + {id}
