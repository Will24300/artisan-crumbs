import hero_bg from "../assets/hero-bg.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <section
      style={{ backgroundImage: `url(${hero_bg})` }}
      className="bg-cover bg-top lg:bg-center bg-no-repeat h-[75vh] sm:h-[80vh] lg:h-[80vh] my-0 lg:my-10 text-white rounded-none lg:rounded-[30px] flex justify-start lg:justify-center items-end lg:items-center relative pb-10 lg:pb-0"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 lg:bg-black/40 rounded-none lg:rounded-[30px]"></div>

      <motion.div 
        className="w-full lg:w-2/4 px-6 lg:px-0 text-left lg:text-center relative z-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="inline-block lg:hidden bg-white/10 backdrop-blur-sm text-[#D46211] text-[11px] font-bold px-3 py-1.5 rounded-[10px] mb-4 tracking-widest border border-white/10 uppercase"
          variants={fadeInUp}
        >
          Since 1994
        </motion.div>
        <motion.h1 
          className="text-5xl  lg:text-[62px] font-black leading-tight lg:leading-22 mb-4 lg:mb-5 tracking-tight"
          variants={fadeInUp}
        >
          Crafted with Love, <span className="text-[#D46211]">Baked</span> with Soul
        </motion.h1>
        <motion.p 
          className="text-gray-200 lg:text-gray-300 text-[15px] lg:text-base mb-6 lg:mb-0 w-[95%] lg:w-full leading-relaxed"
          variants={fadeInUp}
        >
          Experience the warmth of freshly baked artisan bread and handcrafted
          pastries, made with traditional techniques every single morning.
        </motion.p>
        <motion.div 
          className="mt-2 lg:mt-5 flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-10"
          variants={fadeInUp}
        >
          <Link
            to="/shop"
            className="bg-[#D46211] w-full lg:w-auto py-3.5 lg:py-2.5 px-7 cursor-pointer rounded-xl font-bold text-lg lg:text-base shadow-lg shadow-[#D46211]/20 text-center text-white hover:bg-[#E5A10F] transition-colors"
          >
            Shop Now
          </Link>
          <Link to="/#our-story" className="hidden lg:block bg-white/10 backdrop-blur-md py-2.5 px-7 cursor-pointer rounded-2xl font-bold hover:bg-white/20 transition-colors">
            Our Story
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
