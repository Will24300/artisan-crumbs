import { motion } from "framer-motion";
import { ingredientData } from "../data";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function Ingredients() {
  const ingredients = ingredientData;
  return (
    <section
      className="relative -mx-15 my-20 p-6 sm:p-10 overflow-hidden bg-[#F8F7F5] dark:bg-[#12100f] transition-colors duration-300"
      style={{
        backgroundImage:
          "radial-gradient(rgba(212, 98, 17, 0.08) 1.5px, transparent 1.5px)",
        backgroundSize: "22px 22px",
      }}
    >
      <motion.div
        className="text-center relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        <motion.div
          className="flex items-center justify-center gap-3 mb-2"
          variants={headingVariants}
        >
          <span className="h-px w-6 bg-[#D46211]" />
          <h3 className="text-[13px] text-[#D46211] font-bold tracking-[0.15em] uppercase">
            Quality First
          </h3>
          <span className="h-px w-6 bg-[#D46211]" />
        </motion.div>
        <motion.h2
          className="font-serif text-[36px] sm:text-[40px] font-bold text-[#241812] dark:text-stone-100"
          variants={headingVariants}
        >
          Featured Ingredients
        </motion.h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        {ingredients.map((ingredient) => (
          <motion.div
            key={ingredient.id}
            className="flex flex-col justify-center items-center text-center bg-white dark:bg-stone-900 rounded-2xl p-6 gap-4 border border-[#241812]/5 dark:border-stone-800"
            variants={cardVariants}
            whileHover={{
              y: -6,
              boxShadow: "0 16px 40px rgba(212, 98, 17, 0.14)",
              transition: { duration: 0.25 },
            }}
          >
            <motion.div
              className="relative bg-[#FFF4EB] dark:bg-[#D46211]/15 p-4 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center"
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1, transition: { duration: 0.4 } }}
            >
              {/* Dashed stamp ring — quality-seal motif */}
              <span className="absolute inset-[-6px] rounded-full border-2 border-dashed border-[#D46211]/30 dark:border-[#D46211]/45" />
              <img
                src={ingredient.image}
                alt={ingredient.name}
                className="w-full h-full object-contain"
              />
            </motion.div>

            <div>
              <h2 className="text-[20px] font-bold text-[#241812] dark:text-stone-105">{ingredient.name}</h2>
              <span className="block mx-auto mt-1.5 h-[2px] w-6 bg-[#D46211]/50" />
            </div>

            <p className="text-[#64748B] dark:text-stone-450 text-[14px] leading-relaxed">
              {ingredient.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Ingredients;