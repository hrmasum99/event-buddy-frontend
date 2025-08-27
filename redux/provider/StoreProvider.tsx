// "use client";

// import { useRef } from "react";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { type Persistor, persistStore } from "redux-persist";
// import { AppStore, makeStore } from "../store";

// export default function StoreProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const storeRef = useRef<AppStore | null>(null);
//   const persistorRef = useRef<ReturnType<typeof persistStore> | null>(null);

//   if (!storeRef.current) {
//     // Create the store instance the first time this renders
//     storeRef.current = makeStore();
//     persistorRef.current = persistStore(storeRef.current); // Create persistor
//   }

//   return (
//     <Provider store={storeRef.current}>
//       <PersistGate loading={null} persistor={persistorRef.current!}>
//         {children}
//       </PersistGate>
//     </Provider>
//   );
// }

// "use client";

// import { ReactNode } from "react";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { persistStore } from "redux-persist";
// import { makeStore } from "../store";

// const store = makeStore();
// const persistor = persistStore(store);

// export default function StoreProvider({ children }: { children: ReactNode }) {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         {children}
//       </PersistGate>
//     </Provider>
//   );
// }

"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";

const PersistLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    {/* <div className="animate-pulse text-lg">Loading...</div> */}
    <span className="text-3xl mr-4">Loading</span>
    <svg
      className="animate-spin h-8 w-8 text-gray-800"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
