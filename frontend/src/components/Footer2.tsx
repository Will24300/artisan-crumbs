import type { OpeningHour } from "../types";
import iconImg from "../assets/Icon.png";
import { MapPin, Phone, Mail, Globe, Share2, ThumbsUp, ArrowUpRight } from "lucide-react";

const openingHours: OpeningHour[] = [
  { label: "Mon - Fri", hours: "6:00 AM - 6:00 PM" },
  { label: "Saturday", hours: "7:00 AM - 4:00 PM" },
  { label: "Sunday", hours: "8:00 AM - 2:00 PM" },
];

const dayRanges: Record<string, number[]> = {
  "Mon - Fri": [1, 2, 3, 4, 5],
  Saturday: [6],
  Sunday: [0],
};

const parseHourRange = (hours: string) => {
  const [start, end] = hours.split(" - ");
  const to24 = (t: string) => {
    const [time, meridiem] = t.split(" ");
    let [h] = time.split(":").map(Number);
    if (meridiem === "PM" && h !== 12) h += 12;
    if (meridiem === "AM" && h === 12) h = 0;
    return h;
  };
  return { start: to24(start), end: to24(end) };
};

export default function Footer2() {
  const now = new Date();
  const today = now.getDay();
  const currentHour = now.getHours();

  const todayEntry = openingHours.find((entry) => dayRanges[entry.label]?.includes(today));
  const isOpen = todayEntry
    ? (() => {
        const { start, end } = parseHourRange(todayEntry.hours);
        return currentHour >= start && currentHour < end;
      })()
    : false;

  return (
    <footer className="relative bg-[#1C1410] text-slate-400 py-16 px-6 md:px-20 overflow-hidden">
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] pointer-events-none"
        style={{ background: "radial-gradient(circle, #D46211, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-white">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 overflow-hidden shrink-0">
              <img src={iconImg} alt="" className="w-6 h-6 object-contain" />
            </span>
            <h2 className="font-serif text-2xl font-bold tracking-tight">Artisan Crumbs</h2>
          </div>
          <p className="text-sm leading-relaxed">
            Crafting artisan pastries and breads with tradition and love since 1995. Your daily source of baked
            happiness.
          </p>

          <div className="flex gap-3">
            <a
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D46211] hover:text-white transition-colors"
              href="#"
              aria-label="Website"
            >
              <Globe className="w-4.5 h-4.5" />
            </a>

            <a
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D46211] hover:text-white transition-colors"
              href="#"
              aria-label="Share"
            >
              <Share2 className="w-4.5 h-4.5" />
            </a>

            <a
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D46211] hover:text-white transition-colors"
              href="#"
              aria-label="Like"
            >
              <ThumbsUp className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-serif font-bold text-lg">Quick links</h3>
          <ul className="space-y-3 text-sm">
            {["Our Menu", "Order Online", "Catering", "Gift Cards"].map((label) => (
              <li key={label}>
                <a
                  className="group inline-flex items-center gap-1 hover:text-[#F2A469] transition-colors"
                  href="#"
                >
                  {label}
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-serif font-bold text-lg">Contact us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 shrink-0">
                <MapPin className="text-[#D46211] w-4 h-4" />
              </span>
              <span className="pt-1.5">
                123 Baker Street, Kigali City
                <br />
                Kigali, Rwanda
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 shrink-0">
                <Phone className="text-[#D46211] w-4 h-4" />
              </span>
              <a href="tel:+250791954372" className="hover:text-[#F2A469] transition-colors">
                +250 791 954 372
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 shrink-0">
                <Mail className="text-[#D46211] w-4 h-4" />
              </span>
              <a href="mailto:[volonterwich123@gmail.com]" className="hover:text-[#F2A469] transition-colors">
                volonterwicha123@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-serif font-bold text-lg">Opening hours</h3>
          <ul className="space-y-3 text-sm">
            {openingHours.map((entry) => {
              const isTodayRow = dayRanges[entry.label]?.includes(today);
              return (
                <li
                  key={entry.label}
                  className={`flex justify-between ${isTodayRow ? "text-[#F2A469]" : ""}`}
                >
                  <span className="flex items-center gap-1.5">
                    {isTodayRow && <span className="w-1 h-1 rounded-full bg-[#F2A469]" />}
                    {entry.label}
                  </span>
                  <span className={isTodayRow ? "text-[#F2A469] font-semibold" : "text-white"}>
                    {entry.hours}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="pt-2">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isOpen ? "bg-green-500/10 text-green-500" : "bg-white/5 text-slate-400"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-slate-500"}`} />
              {isOpen ? "Open now" : "Closed now"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-16 pt-8 border-t border-white/5 text-center text-xs">
        <p>© 2026 Artisan Crumbs Bakery. All rights reserved. Handcrafted with love.</p>
      </div>
    </footer>
  );
}