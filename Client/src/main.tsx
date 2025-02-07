import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "./components/ui/toaster";
import "./index.css?v=2";
import router from "./routers";
import { persist, store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persist}>
      <RouterProvider router={router} />
    </PersistGate>
    <Toaster />
  </Provider>,
);
