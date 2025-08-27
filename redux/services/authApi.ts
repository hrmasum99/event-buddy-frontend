import {
  NEXT_PUBLIC_API_AUTH_SIGNIN,
  NEXT_PUBLIC_API_AUTH_SIGNUP,
  NEXT_PUBLIC_API_USER_PROFILE,
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
  }),
});

export const { useSignupMutation, useSigninMutation, useGetUserProfileQuery } =
  authApi;
