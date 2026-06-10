import { Search, ShoppingCart, User } from "lucide-react";
import iconImg from "../assets/Icon.png";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center py-5 px-15 border-b border-gray-200">
      <div className="flex justify-between items-center gap-10">
        <Link to="/" className="flex items-center gap-1">
          <img src={iconImg} alt="bread icon" />
          <h2 className="font-bold text-xl">Artisan Crumbs</h2>
        </Link>
        <ul className="flex justify-between items-center gap-5 text-[#334155] text-[15px]">
          <li className="cursor-pointer">Shop</li>
          <li className="cursor-pointer">Daily Specials</li>
          <li className="cursor-pointer">Our Story</li>
          <li className="cursor-pointer">Contact</li>
        </ul>
      </div>
      <div className="flex justify-between items-center gap-5">
        <div className="flex justify-between items-center gap-2 bg-[#F1F5F9] py-2 px-5 rounded-[25px] text-[#94A3B8]">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search pastries..."
            className="bg-transparent outline-none text-[14px]"
          />
        </div>
        <div className="bg-[#F1F5F9] p-2 rounded-3xl cursor-pointer">
          <ShoppingCart size={17} />
        </div>
        <div className="bg-[#F1F5F9] p-2 rounded-3xl cursor-pointer">
          <User size={17} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
