import React from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
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
  // Get cart count from Redux
  const reduxCartItems = useSelector((state: RootState) => state.cart.items);
  const reduxCartCount = reduxCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  // Use Redux cart count if prop not provided
  const cartCount = propCartCount ?? reduxCartCount;

  return (
    <nav className="flex justify-between items-center py-3.5 px-10 bg-white border-b border-gray-200">
      {/* Left Section */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-1.5 font-bold text-[17px] text-gray-900"
        >
          <img
            src={iconImg}
            alt="bread icon"
            className="w-7 h-7 object-contain"
          />
          <h2>Artisan Crumbs</h2>
        </Link>
        <ul className="flex items-center gap-5 text-[#334155] text-sm font-medium">
          <Link
            to="/shop"
            className="cursor-pointer hover:text-gray-900 transition-colors"
          >
            Shop
          </Link>
          <li className="cursor-pointer hover:text-gray-900 transition-colors">
            Daily Specials
          </li>
          <li className="cursor-pointer hover:text-gray-900 transition-colors">
            Our Story
          </li>
          <li className="cursor-pointer hover:text-gray-900 transition-colors">
            Contact
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2.5">
        {/* Search Bar */}
        <div className="flex items-center gap-1.5 bg-[#F1F5F9] py-1.5 px-4 rounded-full text-[#94A3B8]">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search pastries..."
            className="bg-transparent outline-none text-xs text-[#334155] w-28 placeholder:text-[#94A3B8]"
          />
        </div>

        {/* Dynamic Cart Button */}
        <Link
          to="/cart"
          className={`flex items-center gap-1.5 font-semibold text-xs py-1.5 px-3.5 rounded-full transition-colors ${
            cartCount > 0
              ? "bg-[#F59E0B] text-gray-900 hover:bg-[#D97706]"
              : "bg-[#F1F5F9] text-[#334155] hover:bg-gray-200"
          }`}
        >
          <ShoppingCart size={16} />
          <span>Cart ({cartCount})</span>
        </Link>

        {/* Profile Button */}
        <div className="bg-[#F1F5F9] p-2 rounded-full cursor-pointer text-[#334155] hover:bg-gray-200 transition-colors">
          <User size={16} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
