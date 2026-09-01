import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./store";
import { ThemeProvider } from "./features/theme.tsx";

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

