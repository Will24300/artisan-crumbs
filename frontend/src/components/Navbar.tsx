import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import iconImg from "../assets/Icon.png";

interface NavbarProps {
  cartCount?: number;
}

interface RootState {
  cart: {
    items: Array<{
      productId: string | number;
      quantity: number;
    }>;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount: propCartCount }) => {
  const [isFloating, setIsFloating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const currentHash = location.hash;

  useEffect(() => {
    const onScroll = () => setIsFloating(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeNavClass = "text-[#F4AF25] border border-[#F4AF25] rounded-full px-3 py-1 transition-colors";
  const defaultNavClass = "hover:text-gray-900 transition-colors px-3 py-1";
  const getNavLinkClass = (to: string) => {
    const hash = to.includes("#") ? to.substring(to.indexOf("#")) : "";
    if (hash) {
      return location.pathname === "/" && currentHash === hash
        ? activeNavClass
        : defaultNavClass;
    }
    return location.pathname === to ? activeNavClass : defaultNavClass;
  };

  const reduxCartItems = useSelector((state: RootState) => state.cart.items);
  const reduxCartCount = reduxCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const cartCount = propCartCount ?? reduxCartCount;

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={iconImg}
                alt="logo"
                className="h-8 w-8 object-contain"
              />
              <span className="font-bold text-lg text-gray-900">
                Artisan Crumbs
              </span>
            </Link>
          </div>

          {/* Center: Nav Links (hidden on tablet and below) */}
          <ul className="hidden lg:flex items-center gap-6 text-sm text-gray-700">
            <li>
              <Link to="/shop" className={getNavLinkClass("/shop")}>
                Shop
              </Link>
            </li>
            <li>
              <Link to="/#daily-specials" className={getNavLinkClass("/#daily-specials")}>
                Daily Specials
              </Link>
            </li>
            <li>
              <Link to="/#our-story" className={getNavLinkClass("/#our-story")}>
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/contact" className={getNavLinkClass("/contact")}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            {/* Search - hide on very small screens */}
            <div className="hidden md:flex items-center gap-2 bg-[#F1F5F9] py-1 px-3 rounded-full text-[#94A3B8]">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search pastries..."
                className="bg-transparent outline-none text-sm text-[#334155] w-32 placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className={`flex items-center gap-2 font-semibold text-sm py-1.5 px-3 rounded-full transition-colors ${
                cartCount > 0
                  ? "bg-[#F59E0B] text-gray-900 hover:bg-[#D97706]"
                  : "bg-[#F1F5F9] text-[#334155] hover:bg-gray-200"
              } ${isFloating ? "fixed top-4 right-4 z-50 shadow-lg" : ""}`}
              style={isFloating ? { transform: "translateZ(0)" } : undefined}
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart size={16} />
              <span className="text-sm">Cart ({cartCount})</span>
            </Link>

            {/* Profile */}
            <Link
              to="/account"
              className="hidden md:inline-block bg-[#F1F5F9] p-2 rounded-full text-[#334155] hover:bg-gray-200"
            >
              <User size={16} />
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <div className="flex items-center gap-2">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search pastries..."
                className="w-full bg-transparent outline-none text-sm text-[#334155] placeholder:text-[#94A3B8]"
              />
            </div>

            <Link
              to="/shop"
              onClick={() => setMobileOpen(false)}
              className={`block py-2 rounded-md ${getNavLinkClass("/shop")} text-left`}
            >
              Shop
            </Link>
            <Link
              to="/#daily-specials"
              onClick={() => setMobileOpen(false)}
              className={`block py-2 rounded-md ${getNavLinkClass("/#daily-specials")} text-left`}
            >
              Daily Specials
            </Link>
            <Link
              to="/#our-story"
              onClick={() => setMobileOpen(false)}
              className={`block py-2 rounded-md ${getNavLinkClass("/#our-story")} text-left`}
            >
              Our Story
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className={`block py-2 rounded-md ${getNavLinkClass("/contact")} text-left`}
            >
              Contact
            </Link>

            <div className="pt-2 border-t border-gray-100">
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 font-semibold py-2"
              >
                <ShoppingCart size={16} />
                <span>Cart ({cartCount})</span>
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-2"
              >
                <User size={16} />
                <span>Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
