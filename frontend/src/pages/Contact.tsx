import { Clock, MapPin, Send, CheckCircle2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const hoursData = [
  { label: "Mon – Fri", time: "7:00 AM – 6:00 PM", days: [1, 2, 3, 4, 5] },
  { label: "Saturday", time: "8:00 AM – 4:00 PM", days: [6] },
  { label: "Sunday", time: "8:00 AM – 2:00 PM", days: [0] },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
} as const;

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

function Contact() {
  const [sent, setSent] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const today = new Date().getDay();

  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=University+of+Kigali+ULK+Kigali+Rwanda";

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-6 bg-[#D46211]" />
          <span className="text-[#D46211] font-bold text-[13px] tracking-[0.15em] uppercase">
            Contact
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-[42px] font-bold text-[#241812] dark:text-stone-100 mb-4">
          Get in Touch
        </h1>
        <p className="text-[#475569] dark:text-stone-300 text-base max-w-2xl leading-relaxed mb-10">
          We love hearing from our community. Whether you have a question
          about our sourdough, want to pre-order for an event, or just want to
          say hello, we're all ears.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
          {/* Form card */}
          <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-[30px] p-8 shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
            <h2 className="font-serif text-[22px] font-bold mb-6 text-[#241812] dark:text-stone-100">
              Send us a Message
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-[#241812] dark:text-stone-300 mb-2">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Volonte Rwicha"
                  className="w-full px-4 py-3 text-sm text-[#334155] dark:text-stone-200 border border-gray-200 dark:border-stone-850 rounded-2xl outline-none bg-[#FDFDFD] dark:bg-[#12100f] focus:border-[#D46211] focus:ring-4 focus:ring-[#D46211]/10 transition-shadow"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-semibold text-[#241812] dark:text-stone-300 mb-2">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="volonte@example.com"
                  className="w-full px-4 py-3 text-sm text-[#334155] dark:text-stone-200 border border-gray-200 dark:border-stone-850 rounded-2xl outline-none bg-[#FDFDFD] dark:bg-[#12100f] focus:border-[#D46211] focus:ring-4 focus:ring-[#D46211]/10 transition-shadow"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="contact-subject" className="block text-sm font-semibold text-[#241812] dark:text-stone-300 mb-2">
                Subject
              </label>
              <select
                id="contact-subject"
                className="w-full px-4 py-3 text-sm text-[#334155] dark:text-stone-200 border border-gray-200 dark:border-stone-850 rounded-2xl outline-none bg-[#FDFDFD] dark:bg-[#12100f] cursor-pointer transition-shadow"
              >
                <option>General Inquiry</option>
                <option>Pre-order for Event</option>
                <option>Custom Cake</option>
                <option>Wholesale</option>
                <option>Feedback</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="contact-message" className="block text-sm font-semibold text-[#241812] dark:text-stone-300 mb-2">
                Message
              </label>
              <textarea
                id="contact-message"
                placeholder="How can we help you today?"
                rows={5}
                className="w-full px-4 py-3 text-sm text-[#334155] dark:text-stone-200 border border-gray-200 dark:border-stone-850 rounded-2xl outline-none bg-[#FDFDFD] dark:bg-[#12100f] resize-y transition-shadow"
              />
            </div>

            <button
              onClick={() => setSent(true)}
              disabled={sent}
              className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-full text-sm tracking-wide transition-colors cursor-pointer ${
                sent ? "bg-green-600 text-white cursor-default" : "bg-[#D46211] hover:bg-[#b04f0b] text-white"
              }`}
            >
              {sent ? (
                <>
                  <CheckCircle2 size={16} /> Message Sent!
                </>
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </button>
          </div>

          {/* Right column — animated */}
          <motion.div
            className="flex flex-col gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Store Hours — hanging sign */}
              <motion.div
                variants={cardVariants}
                className="relative bg-[#FFF4EB] dark:bg-[#D46211]/5 border border-[#D46211]/15 dark:border-[#D46211]/25 rounded-[30px] pt-9 p-6 overflow-visible"
              >
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-[#D46211]/30" />

                <motion.div
                  className="absolute top-3 left-1/2 -translate-x-1/2 origin-top"
                  initial={{ rotate: -4 }}
                  animate={{ rotate: [-4, 4, -4] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span
                    className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm ${
                      hoursData.some((r) => r.days.includes(today))
                        ? "bg-green-600 text-white"
                        : "bg-gray-400 dark:bg-stone-800 text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    OPEN TODAY
                  </span>
                </motion.div>

                <div className="flex items-center gap-2 mb-4 mt-2">
                  <Clock size={18} className="text-[#D46211]" />
                  <span className="text-xs font-bold text-[#241812] dark:text-stone-100 uppercase tracking-[0.08em]">
                    Store Hours
                  </span>
                </div>

                <motion.div className="text-sm text-[#475569] dark:text-stone-300 space-y-2.5 leading-relaxed" variants={containerVariants}>
                  {hoursData.map((row) => {
                    const isToday = row.days.includes(today);
                    return (
                      <motion.div
                        key={row.label}
                        variants={rowVariants}
                        className={`relative flex justify-between items-center pb-1.5 border-b border-[#D46211]/10 last:border-b-0 last:pb-0 ${
                          isToday ? "text-[#D46211]" : ""
                        }`}
                      >
                        <span className="flex items-center gap-1.5 font-medium">
                          {isToday && (
                            <motion.span
                              className="w-1.5 h-1.5 rounded-full bg-[#D46211]"
                              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            />
                          )}
                          {row.label}
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-stone-200">{row.time}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>

              {/* Our Location */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25 }}
                className="bg-[#FFF4EB] dark:bg-[#D46211]/5 border border-[#D46211]/15 dark:border-[#D46211]/25 rounded-[30px] p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", delay: 0.3, duration: 0.5 }}
                  >
                    <MapPin size={18} className="text-[#D46211]" />
                  </motion.span>
                  <span className="text-xs font-bold text-[#241812] dark:text-stone-100 uppercase tracking-[0.08em]">
                    Our Location
                  </span>
                </div>
                <p className="text-sm text-[#475569] dark:text-stone-300 leading-relaxed mb-4">
                  Independent University of Kigali (ULK)
                  <br />
                  Kigali, Rwanda
                </p>
                
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Independent+University+of+Kigali+Kigali+Rwanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer justify-center rounded-full bg-[#D46211] px-4 py-2 text-sm font-bold text-white hover:bg-[#b04f0b] transition-colors"
                >
                  Get Directions
                </a>
              </motion.div>
            </div>

            {/* Map card */}
            <motion.div
              variants={cardVariants}
              className="bg-white dark:bg-stone-900 rounded-[30px] overflow-hidden border border-gray-100 dark:border-stone-850 shadow-[0_18px_48px_rgba(15,23,42,0.05)]"
            >
              {/* Header bar — names the place, offers a real directions link */}
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-stone-850">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF4EB] dark:bg-stone-800 shrink-0">
                    <MapPin size={15} className="text-[#D46211]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#241812] dark:text-stone-100 truncate">Artisan Crumbs</p>
                    <p className="text-xs text-[#64748B] dark:text-stone-400 truncate">Independent University of Kigali (ULK), Kigali</p>
                  </div>
                </div>
                
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-[#D46211] shrink-0 hover:underline"
                >
                  Open in Maps
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Map area */}
              <div className="relative h-72 sm:h-80">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#F8F7F5] dark:bg-stone-950">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#D46211]/30 border-t-[#D46211] rounded-full animate-spin" />
                      <span className="text-xs text-[#64748B] dark:text-stone-500">Loading map…</span>
                    </div>
                  </div>
                )}

                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=30.0560%2C-1.9800%2C30.0920%2C-1.9420&layer=mapnik&marker=-1.9610%2C30.0740"
                  className="w-full h-full border-none"
                  title="Artisan Crumbs location map"
                  onLoad={() => setMapLoaded(true)}
                />

                {/* Single clean pin marking the spot */}
                {mapLoaded && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
                    <div className="relative flex items-center justify-center w-8 h-8">
                      <motion.span
                        className="absolute w-8 h-8 rounded-full bg-[#D46211]/25"
                        animate={{ scale: [0.5, 1.6], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                      <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#D46211] border-2 border-white shadow-md">
                        <MapPin size={11} className="text-white" fill="white" />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Contact;