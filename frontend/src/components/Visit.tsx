import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Visit() {
  return (
    <section className="bg-[#fdf2dc] flex justify-between items-center p-10 my-10 rounded-2xl">
      <div>
        <h2 className="text-[30px] font-bold">Visit Our Bakery</h2>
        <p className="text-[#475569] text-[16px] my-3">
          123 Baker's Lane, Sweetwater City. <br />
          Open daily from 6 AM to 4 PM.
        </p>
        <Link to="" className="flex justify-start items-center gap-2">
          <MapPin className="text-[#F4AF25] " /> View on Map
        </Link>
      </div>
      <div>
        <Link
          to=""
          className="bg-[#F4AF25] py-2 px-5 rounded-2xl font-semibold text-[16px]"
        >
          Get Directions
        </Link>
        <Link
          to=""
          className="ml-5 bg-white py-2 px-15 rounded-2xl font-semibold text-[16px]"
        >
          Call Us
        </Link>
      </div>
    </section>
  );
}

export default Visit;
