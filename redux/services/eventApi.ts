import { RootState } from "../rootReducer";
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  NEXT_PUBLIC_API_EVENTS,
  NEXT_PUBLIC_API_EVENTS_UPCOMING,
  NEXT_PUBLIC_API_EVENTS_PREVIOUS,
  NEXT_PUBLIC_API_EVENTS_DETAIL,
  NEXT_PUBLIC_API_EVENTS_IMAGE,
  NEXT_PUBLIC_API_EVENTS_MY,
  NEXT_PUBLIC_API_USER_CREATE_EVENT,
  NEXT_PUBLIC_API_USER_UPDATE_EVENT,
  NEXT_PUBLIC_API_USER_DELETE_EVENT,
  NEXT_PUBLIC_API_USER_UPLOAD_EVENT_IMAGE,
} from "../endpoints";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Event", "Events"],
  endpoints: (builder) => ({
    // Get all events with pagination
    getAllEvents: builder.query<
      IPaginationData<IEvent>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 12 }) => ({
        url: `${NEXT_PUBLIC_API_EVENTS}?page=${page}&limit=${limit}`,
      }),
      transformResponse: (response: IPaginationData<IEvent>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: ["Events"],
    }),

    // Get upcoming events with pagination
    getUpcomingEvents: builder.query<
      IPaginationData<IEvent>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 12 }) => ({
        url: `${NEXT_PUBLIC_API_EVENTS_UPCOMING}?page=${page}&limit=${limit}`,
      }),
      transformResponse: (response: IPaginationData<IEvent>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: ["Events"],
    }),

    // Get previous events with pagination
    getPreviousEvents: builder.query<
      IPaginationData<IEvent>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 12 }) => ({
        url: `${NEXT_PUBLIC_API_EVENTS_PREVIOUS}?page=${page}&limit=${limit}`,
      }),
      transformResponse: (response: IPaginationData<IEvent>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: ["Events"],
    }),

    // Get single event by ID
    getEventById: builder.query<IEvent, string | number>({
      query: (id) => ({
        url: `${NEXT_PUBLIC_API_EVENTS_DETAIL}${id}`,
      }),
      transformResponse: (response: ApiSuccessResponse<IEvent>) =>
        response.data,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

    // Get my events (user's created events)
    getMyEvents: builder.query<
      IPaginationData<IEvent>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 12 }) => ({
        url: `${NEXT_PUBLIC_API_EVENTS_MY}?page=${page}&limit=${limit}`,
      }),
      transformResponse: (response: IPaginationData<IEvent>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: ["Events"],
    }),

    // Create new event - FIXED ENDPOINT
    createEvent: builder.mutation<ApiSuccessResponse<IEvent>, Partial<IEvent>>({
      query: (eventData) => ({
        url: NEXT_PUBLIC_API_USER_CREATE_EVENT, // Changed from NEXT_PUBLIC_API_EVENTS
        method: "POST",
        body: eventData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: ApiSuccessResponse<IEvent>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: ["Events"],
    }),

    // Update existing event - FIXED ENDPOINT
    updateEvent: builder.mutation<
      ApiSuccessResponse<IEvent>,
      { id: string | number; data: Partial<IEvent> }
    >({
      query: ({ id, data }) => ({
        url: `${NEXT_PUBLIC_API_USER_UPDATE_EVENT}${id}`, // Changed endpoint
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: ApiSuccessResponse<IEvent>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Event", id },
        "Events",
      ],
    }),

    // Delete event - FIXED ENDPOINT
    deleteEvent: builder.mutation<ApiSuccessResponse<any>, string | number>({
      query: (id) => ({
        url: `${NEXT_PUBLIC_API_USER_DELETE_EVENT}${id}`, // Changed endpoint
        method: "DELETE",
      }),
      transformResponse: (response: ApiSuccessResponse<any>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: (result, error, id) => [{ type: "Event", id }, "Events"],
    }),

    // Upload event image - FIXED ENDPOINT
    uploadEventImage: builder.mutation<
      ApiSuccessResponse<{ imageUrl: string; imagePublicId: string }>,
      { eventId: string | number; imageFile: File }
    >({
      query: ({ eventId, imageFile }) => {
        const formData = new FormData();
        formData.append("image", imageFile);

        return {
          url: `${NEXT_PUBLIC_API_USER_UPLOAD_EVENT_IMAGE}${eventId}`, // Changed endpoint
          method: "POST",
          body: formData,
          // Remove Content-Type header to let browser set it with boundary for FormData
        };
      },
      transformResponse: (
        response: ApiSuccessResponse<{
          imageUrl: string;
          imagePublicId: string;
        }>
      ) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Event", id: eventId },
        "Events",
      ],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetUpcomingEventsQuery,
  useGetPreviousEventsQuery,
  useGetEventByIdQuery,
  useGetMyEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useUploadEventImageMutation,
} = eventApi;
