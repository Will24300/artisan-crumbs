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
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="account" element={<Account />} />
      </Route>
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="cart" element={<Cart />} />
      <Route path="*" element={<ErrorPage />} />
    </>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
