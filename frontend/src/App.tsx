import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Layout from "./components/Layout";
import ErrorPage from "./pages/Error";
import Cart from "./components/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import { CustomCakePage } from "./pages/CustomCake";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="custom-cake" element={<CustomCakePage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="account" element={<Account />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="cart" element={<Cart />} />
    </>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
