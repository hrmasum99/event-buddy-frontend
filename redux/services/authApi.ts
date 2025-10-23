import { date } from "zod";
import {
  NEXT_PUBLIC_API_AUTH_SIGNIN,
  NEXT_PUBLIC_API_AUTH_SIGNUP,
  NEXT_PUBLIC_API_USER_PROFILE,
  NEXT_PUBLIC_API_AUTH_FORGOT_PASSWORD,
  NEXT_PUBLIC_API_AUTH_VERIFY_OTP,
  NEXT_PUBLIC_API_AUTH_RESET_PASSWORD,
  NEXT_PUBLIC_API_AUTH_CHANGE_PASSWORD,
  NEXT_PUBLIC_API_AUTH_2FA_ENABLE,
  NEXT_PUBLIC_API_AUTH_2FA_DISABLE,
  NEXT_PUBLIC_API_AUTH_2FA_VERIFY,
} from "../endpoints";
import { RootState } from "../rootReducer";
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

type LoginType = {
  email: string;
  password: string;
};

type SignupType = {
  fullname: string;
  email: string;
  password: string;
};

type ResetPasswordType = {
  email: string;
  newPassword: string;
};

type EditPasswordType = {
  oldPassword?: string;
  newPassword: string;
};

type Enable2FAType = {
  email: string;
  password: string;
};

type Disable2FAType = {
  email: string;
  password: string;
};

type Verify2FAType = {
  email: string;
  code: string;
};

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User", "Auth"],
  endpoints: (builder) => ({
    signin: builder.mutation<ApiSuccessResponse<IAuth>, LoginType>({
      query: (credentials) => ({
        url: NEXT_PUBLIC_API_AUTH_SIGNIN,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiSuccessResponse<IAuth>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: ["User"],
    }),

    signup: builder.mutation<ApiSuccessResponse<IAuth>, SignupType>({
      query: (credentials) => ({
        url: NEXT_PUBLIC_API_AUTH_SIGNUP,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiSuccessResponse<IAuth>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: ["User"],
    }),

    getUserProfile: builder.query<IUser, void>({
      query: () => NEXT_PUBLIC_API_USER_PROFILE,
      transformResponse: (response: ApiSuccessResponse<IUser>) => response.data,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      providesTags: ["User"],
      // Retry on failure
      extraOptions: {
        maxRetries: 2,
      },
    }),

    forgotPassword: builder.mutation<any, { email: string }>({
      query: (credentials) => ({
        url: NEXT_PUBLIC_API_AUTH_FORGOT_PASSWORD,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiSuccessResponse<{ message: string }>) =>
        response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
    }),

    verifyOTP: builder.mutation<any, { email: string; otp: string }>({
      query: (credentials) => ({
        url: NEXT_PUBLIC_API_AUTH_VERIFY_OTP,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiSuccessResponse<any>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
    }),

    resetPassword: builder.mutation<
      ApiSuccessResponse<{ message: string }>,
      ResetPasswordType
    >({
      query: (credentials) => ({
        url: NEXT_PUBLIC_API_AUTH_RESET_PASSWORD,
        method: "POST",
        body: credentials, // Contains both email and newPassword
      }),
      transformResponse: (response: ApiSuccessResponse<{ message: string }>) =>
        response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
    }),

    changePassword: builder.mutation<any, EditPasswordType>({
      query: (credentials) => ({
        url: NEXT_PUBLIC_API_AUTH_CHANGE_PASSWORD,
        method: "PUT",
        body: credentials,
      }),
      transformResponse: (response: ApiSuccessResponse<any>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
    }),

    enable2FA: builder.mutation<
      ApiSuccessResponse<{ otpauthUrl: string; qrCode: string }>,
      Enable2FAType
    >({
      query: (credentials) => ({
        url: NEXT_PUBLIC_API_AUTH_2FA_ENABLE,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (
        response: ApiSuccessResponse<{ otpauthUrl: string; qrCode: string }>
      ) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: ["User"],
    }),

    disable2FA: builder.mutation<ApiSuccessResponse<any>, Disable2FAType>({
      query: (credentials) => ({
        url: NEXT_PUBLIC_API_AUTH_2FA_DISABLE,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiSuccessResponse<any>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
      invalidatesTags: ["User"],
    }),

    verify2FA: builder.mutation<any, { code: string; email: string }>({
      query: (credentials) => ({
        url: NEXT_PUBLIC_API_AUTH_2FA_VERIFY,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiSuccessResponse<any>) => response,
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        data: response.data as ApiErrorResponse,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useGetUserProfileQuery,
  useForgotPasswordMutation,
  useEnable2FAMutation,
  useDisable2FAMutation,
  useVerify2FAMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
} = authApi;
