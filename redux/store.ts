import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import rootReducer from "./rootReducer";
import { authApi } from "./services/authApi";
import storage from "./ssrSafeStorage";
import { eventApi } from "./services/eventApi";
import { bookingApi } from "./services/bookingApi";
const persistConfig = {
  key: "root", // Key for the persisted state in storage
  storage, // Storage engine (localStorage on client, noop on server)
  whitelist: ["auth"], // Persist only the 'auth' slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer, // Use the persisted reducer
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types from redux-persist
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
        .concat(authApi.middleware)
        .concat(eventApi.middleware)
        .concat(bookingApi.middleware), // Add RTK Query middleware
    devTools: process.env.NODE_ENV !== "production", // Enable DevTools in development
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore["dispatch"];
