import { motion } from "framer-motion";
import checkIcon from "../assets/check.png";
import bakerHands from "../assets/baker-hands.jpg";

const checkItems = [
  "100% Natural Starters",
  "No Artificial Additives",
  "Locally Sourced Grains",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const checkVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function OurPhilosophy() {
  return (
    <motion.section
      className="flex flex-col gap-14 py-20 lg:flex-row lg:items-center lg:gap-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Image — slides in from the left */}
      <motion.div
        className="relative w-full lg:w-1/2 py-6 lg:py-10"
        variants={slideLeft}
      >
        {/* Offset backdrop panel for depth */}
        <div className="absolute inset-0 top-10 left-4 lg:left-6 bg-[#FFF4EB] rounded-4xl -z-10" />

        <motion.img
          src={bakerHands}
          alt="baker hands"
          className="rounded-4xl w-full h-auto object-cover shadow-xl shadow-[#241812]/10"
          whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
        />

        {/* 48HR stamp — real content, not decoration */}
        <div className="absolute -bottom-5 right-6 lg:right-10 bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg border border-[#D46211]/20 rotate-[-6deg]">
          <span className="text-[#D46211] font-bold text-2xl leading-none">48</span>
          <span className="text-[#64748B] text-[10px] font-bold tracking-widest mt-0.5">
            HOURS
          </span>
        </div>
      </motion.div>

      {/* Text — slides in from the right */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col gap-7"
        variants={slideRight}
      >
        <motion.div className="flex items-center gap-3" variants={slideRight}>
          <span className="h-px w-6 bg-[#D46211]" />
          <h3 className="text-[#D46211] font-bold text-[13px] tracking-[0.15em] uppercase">
            Our Philosophy
          </h3>
        </motion.div>

        <motion.h2
          className="font-serif text-[36px] sm:text-[44px] lg:text-[48px] font-bold leading-tight text-[#241812]"
          variants={slideRight}
        >
          Slow Fermented, Heartfully Crafted
        </motion.h2>

        <motion.p
          className="text-[16px] sm:text-[18px] text-[#475569] leading-relaxed"
          variants={slideRight}
        >
          We believe that great bread can't be rushed. That's why we use
          traditional long-fermentation methods that take up to 48 hours. This
          process develops deeper flavors, better texture, and makes our bread
          easier to digest.
        </motion.p>

        {/* Check list — each item staggers in */}
        <motion.div className="space-y-3 mt-2" variants={containerVariants}>
          {checkItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex justify-start items-center gap-3"
              variants={checkVariant}
              custom={i}
            >
              <motion.span
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF4EB] shrink-0"
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.35, type: "spring" }}
              >
                <img src={checkIcon} alt="" className="w-4 h-4" />
              </motion.span>
              <span className="text-[#334155] text-[16px] font-medium">{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default OurPhilosophy;