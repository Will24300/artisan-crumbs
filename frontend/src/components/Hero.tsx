import hero_bg from "../assets/hero-bg.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

function Hero() {
  return (
    <section className="relative h-[75vh] sm:h-[80vh] lg:h-[80vh] my-0 lg:my-10 overflow-hidden rounded-none lg:rounded-[30px] text-white flex justify-start lg:justify-center items-end lg:items-center pb-10 lg:pb-0">
      {/* Background with slow ambient zoom */}
      <motion.div
        style={{ backgroundImage: `url(${hero_bg})` }}
        className="absolute inset-0 bg-cover bg-top lg:bg-center bg-no-repeat"
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 20, ease: "easeOut" }}
      />

      {/* Gradient overlay — darker at the bottom where text sits, lighter up top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/20 lg:bg-gradient-to-r lg:from-black/65 lg:via-black/45 lg:to-black/30" />

      <motion.div
        className="w-full lg:w-2/4 px-6 lg:px-0 text-left lg:text-center relative z-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-[#F2A469] text-[11px] font-bold px-3 py-1.5 rounded-full mb-4 tracking-widest border border-white/15 uppercase"
          variants={fadeInUp}
        >
          <span className="w-1 h-1 rounded-full bg-[#F2A469]" />
          Since 1994
        </motion.div>

        <motion.h1
          className="font-serif text-5xl lg:text-[62px] font-black leading-tight lg:leading-[1.1] mb-4 lg:mb-5 tracking-tight"
          variants={fadeInUp}
        >
          Crafted with love, <span className="text-[#D46211]">baked</span> with soul
        </motion.h1>

        <motion.p
          className="text-gray-200 lg:text-gray-300 text-[15px] lg:text-base mb-6 lg:mb-9 w-[95%] lg:w-[85%] lg:mx-auto leading-relaxed"
          variants={fadeInUp}
        >
          Experience the warmth of freshly baked artisan bread and handcrafted
          pastries, made with traditional techniques every single morning.
        </motion.p>

        <motion.div
          className="mt-2 flex flex-col lg:flex-row justify-center items-center gap-3.5 lg:gap-4"
          variants={fadeInUp}
        >
          <Link
            to="/shop"
            className="bg-[#D46211] w-full lg:w-auto py-3.5 lg:py-3 px-7 cursor-pointer rounded-xl font-bold text-lg lg:text-base shadow-lg shadow-[#D46211]/20 text-center text-white hover:bg-[#b04f0b] transition-colors"
          >
            Shop Now
          </Link>
          <Link
            to="/#our-story"
            className="w-full lg:w-auto bg-white/10 backdrop-blur-md py-3.5 lg:py-3 px-7 cursor-pointer rounded-xl font-bold text-lg lg:text-base text-center border border-white/15 hover:bg-white/20 transition-colors"
          >
            Our Story
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-white/60 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;