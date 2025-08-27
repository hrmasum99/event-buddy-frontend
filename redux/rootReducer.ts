import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { authApi } from "./services/authApi";
import { eventApi } from "./services/eventApi";
import { bookingApi } from "./services/bookingApi";

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
  [bookingApi.reducerPath]: bookingApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
