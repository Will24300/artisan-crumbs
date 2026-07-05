import { Clock, MapPin } from "lucide-react";
import { useState } from "react";

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-[42px] font-bold text-[#0F172A] mb-4">
          Get in Touch
        </h1>
        <p className="text-[#475569] text-base max-w-2xl leading-relaxed mb-10">
          We love hearing from our community. Whether you have a question
          about our sourdough, want to pre-order for an event, or just want to
          say hello, we're all ears.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
          {/* Form card */}
          <div className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
            <h2 className="text-[22px] font-bold mb-6 text-[#0F172A]">
              Send us a Message
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-semibold text-[#0F172A] mb-2"
                >
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Volonte Rwicha"
                  className="w-full px-4 py-3 text-sm text-[#334155] border border-gray-200 rounded-2xl outline-none focus:border-[#D46211] bg-[#FDFDFD]"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-semibold text-[#0F172A] mb-2"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="volonte@example.com"
                  className="w-full px-4 py-3 text-sm text-[#334155] border border-gray-200 rounded-2xl outline-none focus:border-[#D46211] bg-[#FDFDFD]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="contact-subject"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Subject
              </label>
              <select
                id="contact-subject"
                className="w-full px-4 py-3 text-sm text-[#334155] border border-gray-200 rounded-2xl outline-none focus:border-[#D46211] bg-[#FDFDFD] cursor-pointer"
              >
                <option>General Inquiry</option>
                <option>Pre-order for Event</option>
                <option>Custom Cake</option>
                <option>Wholesale</option>
                <option>Feedback</option>
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="contact-message"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                placeholder="How can we help you today?"
                rows={5}
                className="w-full px-4 py-3 text-sm text-[#334155] border border-gray-200 rounded-2xl outline-none focus:border-[#D46211] bg-[#FDFDFD] resize-y"
              />
            </div>

            <button
              onClick={() => setSent(true)}
              className="w-full bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold py-3.5 rounded-full text-sm tracking-wide transition-colors cursor-pointer"
            >
              {sent ? "Message Sent!" : "Send Message"}
            </button>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Store Hours */}
              <div className="bg-[#FEF9EC] border border-[#FDE9A2] rounded-[30px] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} color="#F59E0B" />
                  <span className="text-xs font-bold text-[#78350F] uppercase tracking-[0.08em]">
                    Store Hours
                  </span>
                </div>
                <div className="text-sm text-[#92400E] space-y-2.5 leading-relaxed">
                  <div className="flex justify-between border-b border-[#FDE9A2]/40 pb-1.5">
                    <span>Mon – Fri</span>
                    <span className="font-semibold">7:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FDE9A2]/40 pb-1.5">
                    <span>Saturday</span>
                    <span className="font-semibold">8:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">8:00 AM – 2:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Our Location */}
              <div className="bg-[#FEF9EC] border border-[#FDE9A2] rounded-[30px] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} color="#F59E0B" />
                  <span className="text-xs font-bold text-[#78350F] uppercase tracking-[0.08em]">
                    Our Location
                  </span>
                </div>
                <p className="text-sm text-[#92400E] leading-relaxed mb-4">
                  University of Kigali (ULK)
                  <br />
                  KN 3 Road, Kigali, Rwanda
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=University+of+Kigali+ULK+Kigali+Rwanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer justify-center rounded-full bg-[#D46211] px-4 py-2 text-sm font-bold text-white hover:bg-[#b04f0b] transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Map Frame */}
            <div className="rounded-[30px] overflow-hidden border border-gray-100 h-72 sm:h-80 relative shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=30.0560%2C-1.9800%2C30.0920%2C-1.9420&layer=mapnik&marker=-1.9610%2C30.0740"
                className="w-full h-full border-none"
                title="Artisan Crumbs map"
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#78350F] text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none shadow-md">
                🏪 ARTISAN CRUMBS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
