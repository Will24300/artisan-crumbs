import React, { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, Menu, X, LayoutDashboard, LogOut, Sun, Moon, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth";
import { useTheme } from "../features/theme";
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
  return `hsl(${hue}, 70%, 42%)`;
};

export const Navbar: React.FC<NavbarProps> = ({ cartCount: propCartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const currentHash = location.hash;
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeNavClass =
    "text-white bg-[#D46211] rounded-full px-4 py-1.5 transition-colors";
  const defaultNavClass =
    "text-gray-600 dark:text-stone-300 hover:text-[#241812] dark:hover:text-stone-100 rounded-full px-4 py-1.5 transition-colors";
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
    <nav
      className={`sticky top-0 z-40 w-full bg-white/90 dark:bg-stone-950/95 backdrop-blur-md transition-shadow duration-300 ${isScrolled ? "shadow-[0_4px_20px_rgba(36,24,18,0.06)] border-b border-transparent" : "border-b border-gray-100 dark:border-stone-800/50"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FFF4EB] overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img src={iconImg} alt="" className="h-6 w-6 object-contain" />
              </span>
              <span className="font-serif font-bold text-lg text-[#241812] dark:text-stone-100">
                Artisan Crumbs
              </span>
            </Link>
          </div>

          {/* Center: Nav Links (hidden on tablet and below) */}
          <ul className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <li>
              <Link to="/shop" className={getNavLinkClass("/shop")}>
                Shop
              </Link>
            </li>
            <li>
              <Link to="/custom-cake" className={`flex items-center gap-1 ${getNavLinkClass("/custom-cake")}`}>
                Custom Cake
              </Link>
            </li>
            <li>
              <Link to="/#top-selling" className={getNavLinkClass("/#top-selling")}>
                Top Selling
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
            <div className="hidden md:flex items-center gap-2 bg-[#F8F7F5] dark:bg-stone-800 py-2 px-3.5 rounded-full text-[#94A3B8] border border-transparent focus-within:border-[#D46211]/40 focus-within:bg-white dark:focus-within:bg-stone-700 transition-colors">
              <Search size={15} className="shrink-0" />
              <input
                type="search"
                placeholder="Search pastries..."
                className="bg-transparent outline-none text-sm text-[#334155] dark:text-stone-200 w-28 lg:w-36 placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F8F7F5] dark:bg-stone-800 text-[#241812] dark:text-stone-300 hover:bg-[#FFF4EB] dark:hover:bg-stone-700 hover:text-[#D46211] transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart — hidden for admin users */}
            {!isAdmin && (
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#F8F7F5] dark:bg-stone-800 text-[#241812] dark:text-stone-300 hover:bg-[#FFF4EB] dark:hover:bg-stone-700 hover:text-[#D46211] transition-colors"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#D46211] text-white text-[10px] font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {authUser ? (
              <div className="hidden md:flex items-center gap-3 relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  className="hidden lg:inline-flex items-center justify-center rounded-full h-10 w-10 text-white font-bold text-sm cursor-pointer transition-transform duration-200 hover:scale-105 ring-2 ring-white shadow-sm"
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
                    <div className="absolute right-0 top-12 w-52 bg-white dark:bg-stone-900 rounded-2xl border border-gray-100 dark:border-stone-800 shadow-[0_16px_40px_rgba(36,24,18,0.12)] z-50 p-2">
                      <div className="flex items-center gap-2.5 px-2 py-2.5 border-b border-gray-100 dark:border-stone-800 mb-1">
                        <span
                          className="flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: profileColor }}
                        >
                          {authUser.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#241812] dark:text-stone-200 truncate">
                            {authUser.name}
                          </p>
                          <p className="text-xs text-[#64748B] dark:text-stone-400 capitalize">
                            {authUser.role}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-[#475569] dark:text-stone-300 hover:bg-[#FFF4EB] dark:hover:bg-[#D46211]/10 hover:text-[#D46211] transition-colors"
                      >
                        <User size={15} />
                        My Profile & Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-[#475569] dark:text-stone-300 hover:bg-[#FFF4EB] dark:hover:bg-[#D46211]/10 hover:text-[#D46211] transition-colors"
                        >
                          <LayoutDashboard size={15} />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-2 bg-[#D46211] hover:bg-[#b04f0b] text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-full text-[#241812] dark:text-stone-200 hover:bg-[#F8F7F5] dark:hover:bg-stone-850 transition-colors"
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
        <div className="lg:hidden border-t border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-950">
          <div className="px-4 pt-4 pb-6 space-y-1">
            <div className="flex items-center gap-2 bg-[#F8F7F5] dark:bg-stone-800 rounded-full py-2.5 px-4 mb-3">
              <Search size={16} className="text-[#94A3B8]" />
              <input
                type="search"
                placeholder="Search pastries..."
                className="w-full bg-transparent outline-none text-sm text-[#334155] dark:text-stone-200 placeholder:text-[#94A3B8]"
              />
            </div>

            <Link
              to="/shop"
              onClick={() => setMobileOpen(false)}
              className={`block py-2.5 px-4 rounded-xl text-sm font-medium ${getNavLinkClass("/shop")} text-left`}
            >
              Shop
            </Link>
            <Link
              to="/custom-cake"
              onClick={() => setMobileOpen(false)}
              className={`block py-2.5 px-4 rounded-xl text-sm font-medium ${getNavLinkClass("/custom-cake")} text-left`}
            >
              Custom Cake ✨
            </Link>
            <Link
              to="/#top-selling"
              onClick={() => setMobileOpen(false)}
              className={`block py-2.5 px-4 rounded-xl text-sm font-medium ${getNavLinkClass("/#top-selling")} text-left`}
            >
              Top Selling
            </Link>
            <Link
              to="/#our-story"
              onClick={() => setMobileOpen(false)}
              className={`block py-2.5 px-4 rounded-xl text-sm font-medium ${getNavLinkClass("/#our-story")} text-left`}
            >
              Our Story
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className={`block py-2.5 px-4 rounded-xl text-sm font-medium ${getNavLinkClass("/contact")} text-left`}
            >
              Contact
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium ${getNavLinkClass("/admin")} text-left`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}

            {/* Dark mode toggle — mobile */}
            <button
              type="button"
              onClick={() => { toggleDarkMode(); setMobileOpen(false); }}
              className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-[#475569] dark:text-stone-300 hover:bg-[#F8F7F5] dark:hover:bg-stone-800 w-full"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <div className="pt-3 mt-2 border-t border-gray-100 dark:border-stone-850 space-y-1">
              {!isAdmin && (
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-[#475569] dark:text-stone-300 hover:bg-[#F8F7F5] dark:hover:bg-stone-850"
                >
                  <ShoppingCart size={16} />
                  Cart ({cartCount})
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
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-left w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 mt-2 bg-[#D46211] hover:bg-[#b04f0b] text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-colors"
                >
                  Login
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