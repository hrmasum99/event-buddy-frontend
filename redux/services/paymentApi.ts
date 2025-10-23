import { RootState } from "../rootReducer";
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  NEXT_PUBLIC_API_PAYMENTS_INITIATE,
  NEXT_PUBLIC_API_PAYMENTS_QUERY,
  NEXT_PUBLIC_API_PAYMENTS_DETAIL,
  NEXT_PUBLIC_API_PAYMENTS_MY,
  NEXT_PUBLIC_API_PAYMENTS_ALL,
  NEXT_PUBLIC_API_REFUNDS,
  NEXT_PUBLIC_API_REFUNDS_ALL,
  NEXT_PUBLIC_API_REFUNDS_DETAIL,
  NEXT_PUBLIC_API_REFUNDS_APPROVE,
  NEXT_PUBLIC_API_REFUNDS_REJECT,
} from "../endpoints";

interface InitiatePaymentRequest {
  bookingId: number;
  eventId: number;
  seatsBooked: number;
  unitPrice: number;
  couponCode?: string;
  method?: string;
}

interface InitiatePaymentResponse {
  gatewayUrl: string;
  tranId: string;
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Payment", "Refund"],
  endpoints: (builder) => ({
    // ======= PAYMENT APIs =======
    initiatePayment: builder.mutation<
      ApiSuccessResponse<InitiatePaymentResponse>,
      InitiatePaymentRequest
    >({
      query: (body) => ({
        url: NEXT_PUBLIC_API_PAYMENTS_INITIATE,
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiSuccessResponse<InitiatePaymentResponse>
      ) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: ["Payment"],
    }),

    queryTransaction: builder.query<
      ApiSuccessResponse<any>,
      { transactionId: string }
    >({
      query: ({ transactionId }) =>
        `${NEXT_PUBLIC_API_PAYMENTS_QUERY}?tran_id=${transactionId}`,
      providesTags: ["Payment"],
    }),

    getMyPayments: builder.query<
      IPaginationData<IPayment>,
      { page?: number; limit?: number; tranId?: string; status?: string }
    >({
      query: ({ page = 1, limit = 10, tranId, status }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (tranId) params.append("tranId", tranId);
        if (status) params.append("status", status);
        return `${NEXT_PUBLIC_API_PAYMENTS_MY}?${params.toString()}`;
      },
      transformResponse: (response: IPaginationData<IPayment>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: ["Payment"],
    }),

    // Get single booking by ID
    getPaymentById: builder.query<IPayment, string | number>({
      query: (id) => ({
        url: `${NEXT_PUBLIC_API_PAYMENTS_DETAIL}${id}`,
      }),
      transformResponse: (response: ApiSuccessResponse<IPayment>) =>
        response.data,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    getAllPayments: builder.query<
      IPaginationData<IPayment>,
      { page?: number; limit?: number; tranId?: string; status?: string }
    >({
      query: ({ page = 1, limit = 10, tranId, status }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (tranId) params.append("tranId", tranId);
        if (status) params.append("status", status);
        return `${NEXT_PUBLIC_API_PAYMENTS_ALL}?${params.toString()}`;
      },
      transformResponse: (response: IPaginationData<IPayment>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: ["Payment"],
    }),

    // ======= REFUND APIs =======
    getRefunds: builder.query<
      ApiSuccessResponse<IRefund[]>,
      { reason?: string; status?: string }
    >({
      query: ({ reason, status }) => {
        const params = new URLSearchParams();
        if (reason) params.append("reason", reason);
        if (status) params.append("status", status);
        return `${NEXT_PUBLIC_API_REFUNDS}?${params.toString()}`;
      },
      transformResponse: (response: ApiSuccessResponse<IRefund[]>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: ["Refund"],
    }),

    getAllRefunds: builder.query<ApiSuccessResponse<any[]>, void>({
      query: () => NEXT_PUBLIC_API_REFUNDS_ALL,
      providesTags: ["Refund"],
    }),

    getRefundById: builder.query<ApiSuccessResponse<any>, number>({
      query: (id) => `${NEXT_PUBLIC_API_REFUNDS_DETAIL}${id}`,
      providesTags: (result, error, id) => [{ type: "Refund", id }],
    }),

    approveRefund: builder.mutation<ApiSuccessResponse<any>, number>({
      query: (id) => ({
        url: `${NEXT_PUBLIC_API_REFUNDS_APPROVE}${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Refund", id }],
    }),

    rejectRefund: builder.mutation<ApiSuccessResponse<any>, number>({
      query: (id) => ({
        url: `${NEXT_PUBLIC_API_REFUNDS_REJECT}${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Refund", id }],
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useQueryTransactionQuery,
  useGetMyPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetAllPaymentsQuery,
  useGetRefundsQuery,
  useGetAllRefundsQuery,
  useGetRefundByIdQuery,
  useApproveRefundMutation,
  useRejectRefundMutation,
} = paymentApi;
