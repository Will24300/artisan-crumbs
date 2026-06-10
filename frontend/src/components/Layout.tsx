import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function Layout() {
  return (
    <div>
      <Navbar />
      <div className="px-15">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
