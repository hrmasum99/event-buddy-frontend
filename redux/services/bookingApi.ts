import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../rootReducer";
import {
  NEXT_PUBLIC_API_BOOKINGS_AVAILABLE_SEATS,
  NEXT_PUBLIC_API_BOOKINGS_MY,
  NEXT_PUBLIC_API_BOOKINGS_NEW,
  NEXT_PUBLIC_API_BOOKINGS_CANCEL,
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
  tagTypes: ["Booking", "SeatInfo"],
  endpoints: (builder) => ({
    // Get available seats for an event
    getAvailableSeats: builder.query<ApiSuccessResponse<ISeatInfo>, number>({
      query: (eventId) =>
        `${NEXT_PUBLIC_API_BOOKINGS_AVAILABLE_SEATS}${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "SeatInfo", id: eventId },
      ],
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
      { eventId: number; seatsBooked: number }
    >({
      query: ({ eventId, seatsBooked }) => {
        const url = `${NEXT_PUBLIC_API_BOOKINGS_NEW}${eventId}`;
        const body = { seatsBooked: seatsBooked };

        console.log("Booking API - Making request:", {
          url: url,
          fullUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
          method: "POST",
          body: body,
          eventId,
          seatsBooked,
          endpoint: NEXT_PUBLIC_API_BOOKINGS_NEW,
        });

        return {
          url: url,
          method: "POST",
          body: body,
        };
      },
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
  }),
});

export const {
  useGetAvailableSeatsQuery,
  useGetMyBookingsQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
} = bookingApi;
