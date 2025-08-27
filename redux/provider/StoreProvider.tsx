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

"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { makeStore } from "../store";

const store = makeStore();
const persistor = persistStore(store);

export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
