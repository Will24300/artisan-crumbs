import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import cartReducer from "./features/cart.ts";
import authReducer from "./features/auth.ts";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./features/theme.tsx";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  </Provider>,
);

