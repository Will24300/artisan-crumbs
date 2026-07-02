import React, { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, Menu, X, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth";
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
  auth: {
    user: {
      name: string;
      role: string;
    } | null;
  };
}

const getColorFromName = (name: string) => {
  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 75%, 45%)`;
};

export const Navbar: React.FC<NavbarProps> = ({ cartCount: propCartCount }) => {
  const [isFloating, setIsFloating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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
  const authUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = authUser?.role === "admin";
  const reduxCartCount = reduxCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const cartCount = propCartCount ?? reduxCartCount;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileColor = useMemo(
    () => (authUser ? getColorFromName(authUser.name) : "#F1F5F9"),
    [authUser],
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

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
            {/* Dashboard link — only visible to admins */}
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 ${getNavLinkClass("/admin")}`}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
              </li>
            )}
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

            {/* Cart — hidden for admin users */}
            {!isAdmin && (
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
            )}

            {authUser ? (
              <div className="hidden md:flex items-center gap-3 relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  className="hidden lg:inline-flex items-center justify-center rounded-full h-10 w-10 text-white font-bold cursor-pointer transition transform hover:scale-105"
                  style={{ backgroundColor: profileColor }}
                  aria-label="Toggle user menu"
                  title={`Logged in as ${authUser.name}`}
                >
                  {authUser.name.charAt(0).toUpperCase()}
                </button>
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {authUser.name}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {authUser.role}
                        </p>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition"
                        >
                          <LayoutDashboard size={14} />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-2 bg-[#F1F5F9] p-2 rounded-full text-[#334155] hover:bg-gray-200"
              >
                <span>Login</span>
              </Link>
            )}

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

            {/* Dashboard link for admin (mobile) */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 py-2 rounded-md ${getNavLinkClass("/admin")} text-left`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}

            <div className="pt-2 border-t border-gray-100">
              {/* Cart — hidden for admin in mobile too */}
              {!isAdmin && (
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-semibold py-2"
                >
                  <ShoppingCart size={16} />
                  <span>Cart ({cartCount})</span>
                </Link>
              )}
              {authUser ? (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(logout());
                    setMobileOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-2 py-2 text-left w-full"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ backgroundColor: profileColor }}>
                    {authUser.name.charAt(0).toUpperCase()}
                  </span>
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2"
                >
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
