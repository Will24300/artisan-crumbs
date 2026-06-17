import { MapPin } from "lucide-react";

function Visit() {
  const address = encodeURIComponent("123 Baker's Lane, Kigali City");
  const viewOnMapUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
  const getDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;

  return (
    <section className="bg-[#fdf2dc] flex justify-between items-center p-10 my-10 rounded-2xl">
      <div>
        <h2 className="text-[30px] font-bold">Visit Our Bakery</h2>
        <p className="text-[#475569] text-[16px] my-3">
          123 Baker's Lane, Sweetwater City. <br />
          Open daily from 6 AM to 4 PM.
        </p>
        <a
          href={viewOnMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-start items-center gap-2 hover:underline"
        >
          <MapPin className="text-[#F4AF25]" /> View on Map
        </a>
      </div>

      <div className="flex items-center">
        <a
          href={getDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#F4AF25] py-2 px-5 rounded-2xl font-semibold text-[16px] hover:bg-[#dca022] transition-colors"
        >
          Get Directions
        </a>

        <a
          href="tel:+250791954372"
          className="ml-5 bg-white py-2 px-6 rounded-2xl font-semibold text-[16px] border border-gray-200 text-center hover:bg-gray-50 transition-colors"
        >
          Call Us
        </a>
      </div>
    </section>
  );
}

export default Visit;
