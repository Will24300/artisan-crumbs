import { Link } from "react-router-dom";
import iconImg from "../assets/Icon.png";
import { ChevronsLeftRightEllipsis, Mail, Share2 } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#F1F5F9] text-[#94A3B8] p-10">
      <div className="border-b border-gray-200 pb-10 flex justify-between  gap-10">
        <div className="flex flex-col justify-start gap-5 w-1/4  ">
          <div className="flex items-center gap-1 text-black">
            <img src={iconImg} alt="bread icon" />
            <h2 className="font-bold text-xl">Artisan Crumbs</h2>
          </div>
          <p className="text-[16px]">
            Crafting the finest sourdough and pastries since 1994. Quality
            ingredients, traditional methods, and lots of love.
          </p>
          <div className="flex justify-start items-center gap-5">
            <Link
              to=""
              className="bg-[#E2E8F0] text-[#475569] p-1.5 rounded-3xl"
            >
              <Share2 />
            </Link>
            <Link
              to=""
              className="bg-[#E2E8F0] text-[#475569] p-1.5 rounded-3xl"
            >
              <Mail />
            </Link>
            <Link
              to=""
              className="bg-[#E2E8F0] text-[#475569] p-1.5 rounded-3xl"
            >
              <ChevronsLeftRightEllipsis />
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-start gap-5 w-1/4">
          <h2 className="font-bold text-[18px] text-black">Quick Links</h2>
          <ul className="space-y-2">
            <li>Shop Online</li>
            <li>Wholesale</li>
            <li>Gift Cards</li>
            <li>Careers</li>
          </ul>
        </div>
        <div className="flex flex-col justify-start gap-5 w-1/4">
          <h2 className="font-bold text-[18px] text-black">Help </h2>
          <ul className="space-y-2">
            <li>Order Status</li>
            <li>Shipping Info</li>
            <li>Returns</li>
            <li>Contact Support</li>
          </ul>
        </div>
        <div className="flex flex-col justify-start gap-5 w-1/4">
          <h2 className="font-bold text-[18px] text-black">Newsletter </h2>
          <p>Join our list for fresh updates and weekly recipes.</p>
          <form className="flex flex-col justify-start">
            <input
              type="email"
              placeholder="Your email"
              className="bg-white outline-none pl-4 py-4 rounded-4xl border border-gray-200 text-black"
            />
            <button className="bg-[#F4AF25] text-black py-4 rounded-4xl mt-4 font-bold">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <p className="text-center mt-10 text-[12px]">
        &copy; 2026 Artisan Crumbs Bakery. All rights reserved. Sourdough with
        soul.
      </p>
    </footer>
  );
}

export default Footer;
