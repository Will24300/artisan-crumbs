import { MapPin, Clock, Phone, ArrowUpRight } from "lucide-react";

function Visit() {
  const address = encodeURIComponent("123 Baker's Lane, Kigali City");
  const viewOnMapUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
  const getDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;

  const openHour = 6;
  const closeHour = 16;
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= openHour && currentHour < closeHour;

  return (
    <section className="relative bg-[#FFF4EB] flex flex-col gap-8 p-8 sm:p-10 my-10 rounded-3xl border-2 border-dashed border-[#D46211]/25 lg:flex-row lg:items-center lg:justify-between overflow-hidden">
      {/* Ticket-stub notches — assumes page background is white */}
      <span className="hidden lg:block absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />
      <span className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />

      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#D46211] shrink-0">
            <MapPin size={20} className="text-white" />
          </span>
          <h2 className="font-serif text-[28px] sm:text-[30px] font-bold text-[#241812]">
            Visit Our Bakery
          </h2>
        </div>

        <p className="text-[#475569] text-[16px] leading-relaxed">
          123 Baker's Lane, Kigali City
        </p>

        <div className="flex items-center gap-2 mt-2 mb-4">
          <Clock size={15} className="text-[#64748B]" />
          <span className="text-[#475569] text-[14px]">Open daily, 6 AM – 4 PM</span>
          <span
            className={`ml-1 inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full ${
              isOpen ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-600" : "bg-gray-500"}`}
            />
            {isOpen ? "Open now" : "Closed"}
          </span>
        </div>

        {/* FIXED: Restored the opening anchor tag here */}
        <a
          href={viewOnMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[#D46211] font-semibold text-[15px]"
        >
          View on Map
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* FIXED: Restored the opening anchor tag here */}
        <a
          href={getDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D46211] py-3 px-6 rounded-2xl font-semibold text-[16px] text-center text-white hover:bg-[#b04f0b] transition-colors"
        >
          Get Directions
        </a>

        {/* FIXED: Restored the opening anchor tag here */}
        <a
          href="tel:+250791954372"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white py-3 px-6 rounded-2xl font-semibold text-[16px] border border-[#241812]/10 text-[#241812] text-center hover:bg-gray-50 transition-colors"
        >
          <Phone size={16} className="text-[#D46211]" />
          Call Us
        </a>
      </div>
    </section>
  );
}

export default Visit;