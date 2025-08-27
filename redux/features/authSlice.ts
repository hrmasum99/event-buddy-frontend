import { RootState } from "@/redux/rootReducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

type LoggedInUserPayload = {
  user: IUser;
  access_token: string;
};

export interface AuthState {
  user: IUser | null;
  access_token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // Add hydration flag
}

const initialState: AuthState = {
  user: null,
  access_token: null,
  isAuthenticated: false,
  isHydrated: false,
};

const AUTH_KEY = `${process.env.NEXT_PUBLIC_AUTH_KEY}`;
const ACCESS_TOKEN_KEY = `${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedInUser(state, action: PayloadAction<LoggedInUserPayload>) {
      state.access_token = action.payload.access_token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isHydrated = true;

      // Store in cookies
      Cookies.set(ACCESS_TOKEN_KEY, action.payload.access_token);
      Cookies.set(AUTH_KEY, JSON.stringify(action.payload));
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isHydrated = true;
    },
    logout: (state) => {
      state.access_token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.isHydrated = true;

      // Clear cookies
      Cookies.remove(AUTH_KEY);
      Cookies.remove(ACCESS_TOKEN_KEY);
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
      state.isAuthenticated = true;
      Cookies.set(ACCESS_TOKEN_KEY, action.payload);
    },
    setTokens: (
      state,
      action: PayloadAction<{
        access_token: string;
      }>
    ) => {
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
      Cookies.set(ACCESS_TOKEN_KEY, action.payload.access_token);
    },
    // Add hydration action for redux-persist
    setHydrated: (state) => {
      state.isHydrated = true;
    },
    // Initialize auth from cookies (for SSR/hydration)
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        const authData = Cookies.get(AUTH_KEY);
        const token = Cookies.get(ACCESS_TOKEN_KEY);

        if (authData && token) {
          try {
            const parsed = JSON.parse(authData);
            state.user = parsed.user;
            state.access_token = token;
            state.isAuthenticated = true;
          } catch (error) {
            console.error("Error parsing auth data from cookies:", error);
          }
        }
        state.isHydrated = true;
      }
    },
  },
});

export const {
  setLoggedInUser,
  setUser,
  logout,
  setAccessToken,
  setTokens,
  setHydrated,
  initializeAuth,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
