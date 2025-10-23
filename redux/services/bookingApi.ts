import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../rootReducer";
import {
  NEXT_PUBLIC_API_BOOKINGS_AVAILABLE_SEATS,
  NEXT_PUBLIC_API_BOOKINGS_DETAIL,
  NEXT_PUBLIC_API_BOOKINGS_MY,
  NEXT_PUBLIC_API_BOOKINGS_NEW,
  NEXT_PUBLIC_API_BOOKINGS_CANCEL,
  NEXT_PUBLIC_API_DOCUMENTS_INVOICE,
  NEXT_PUBLIC_API_DOCUMENTS_TICKET,
  NEXT_PUBLIC_API_DOCUMENTS_ALL_INVOICES,
  NEXT_PUBLIC_API_DOCUMENTS_ALL_TICKETS,
  NEXT_PUBLIC_API_DOCUMENTS_MY_INVOICES,
  NEXT_PUBLIC_API_DOCUMENTS_MY_TICKETS,
} from "../endpoints";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Booking", "SeatInfo", "Document"],
  endpoints: (builder) => ({
    // Get available seats for an event
    getAvailableSeats: builder.query<ApiSuccessResponse<ISeatInfo>, number>({
      query: (eventId) =>
        `${NEXT_PUBLIC_API_BOOKINGS_AVAILABLE_SEATS}${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "SeatInfo", id: eventId },
      ],
    }),

    // Get single booking by ID
    getBookingById: builder.query<IBooking, string | number>({
      query: (id) => ({
        url: `${NEXT_PUBLIC_API_BOOKINGS_DETAIL}${id}`,
      }),
      transformResponse: (response: ApiSuccessResponse<IBooking>) =>
        response.data,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    // Get user's bookings
    getMyBookings: builder.query<ApiSuccessResponse<IBooking[]>, void>({
      query: () => NEXT_PUBLIC_API_BOOKINGS_MY,
      transformResponse: (response: ApiSuccessResponse<IBooking[]>) => {
        console.log("My bookings API response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.log("My bookings API error:", response);
        return response;
      },
      providesTags: ["Booking"],
    }),

    // Create new booking
    createBooking: builder.mutation<
      ApiSuccessResponse<IBooking>,
      { eventId: number; quantity: number }
    >({
      query: ({ eventId, quantity }) => ({
        url: `${NEXT_PUBLIC_API_BOOKINGS_NEW}${eventId}`,
        method: "POST",
        body: { quantity },
      }),
      transformResponse: (response: ApiSuccessResponse<IBooking>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        "Booking",
        { type: "SeatInfo", id: eventId },
      ],
    }),

    // Cancel booking
    cancelBooking: builder.mutation<ApiSuccessResponse<void>, number>({
      query: (bookingId) => ({
        url: `${NEXT_PUBLIC_API_BOOKINGS_CANCEL}${bookingId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiSuccessResponse<void>) => {
        console.log("Cancel booking API response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.log("Cancel booking API error:", response);
        return response;
      },
      invalidatesTags: ["Booking"],
    }),

    // ======= DOCUMENT APIs =======
    getInvoiceById: builder.query<ApiSuccessResponse<any>, number>({
      query: (id) => `${NEXT_PUBLIC_API_DOCUMENTS_INVOICE}${id}`,
      providesTags: ["Document"],
    }),

    getTicketById: builder.query<ApiSuccessResponse<any>, number>({
      query: (id) => `${NEXT_PUBLIC_API_DOCUMENTS_TICKET}${id}`,
      providesTags: ["Document"],
    }),

    getAllInvoices: builder.query<ApiSuccessResponse<any[]>, void>({
      query: () => NEXT_PUBLIC_API_DOCUMENTS_ALL_INVOICES,
      providesTags: ["Document"],
    }),

    getAllTickets: builder.query<ApiSuccessResponse<any[]>, void>({
      query: () => NEXT_PUBLIC_API_DOCUMENTS_ALL_TICKETS,
      providesTags: ["Document"],
    }),

    getMyInvoices: builder.query<ApiSuccessResponse<any[]>, void>({
      query: () => NEXT_PUBLIC_API_DOCUMENTS_MY_INVOICES,
      providesTags: ["Document"],
    }),

    getMyTickets: builder.query<ApiSuccessResponse<any[]>, void>({
      query: () => NEXT_PUBLIC_API_DOCUMENTS_MY_TICKETS,
      providesTags: ["Document"],
    }),
  }),
});

export const {
  useGetAvailableSeatsQuery,
  useGetBookingByIdQuery,
  useGetMyBookingsQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useGetAllInvoicesQuery,
  useGetAllTicketsQuery,
  useGetInvoiceByIdQuery,
  useGetMyInvoicesQuery,
  useGetMyTicketsQuery,
  useGetTicketByIdQuery,
} = bookingApi;
