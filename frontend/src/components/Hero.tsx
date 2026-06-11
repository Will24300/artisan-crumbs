import hero_bg from "../assets/hero-bg.jpg";

function Hero() {
  return (
    <section
      style={{ backgroundImage: `url(${hero_bg})` }}
      className="bg-cover bg-top lg:bg-center bg-no-repeat h-[85vh] lg:h-[80vh] my-0 lg:my-10 text-white rounded-none lg:rounded-[30px] flex justify-start lg:justify-center items-end lg:items-center relative pb-10 lg:pb-0"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 lg:bg-black/40 rounded-none lg:rounded-[30px]"></div>

      <div className="w-full lg:w-2/4 px-6 lg:px-0 text-left lg:text-center relative z-10">
        <div className="inline-block lg:hidden bg-white/10 backdrop-blur-sm text-[#D46211] text-[11px] font-bold px-3 py-1.5 rounded-[10px] mb-4 tracking-widest border border-white/10 uppercase">
          Since 1994
        </div>
        <h1 className="text-5xl  lg:text-[62px] font-black leading-tight lg:leading-22 mb-4 lg:mb-5 tracking-tight">
          Crafted with Love, Baked with Soul
        </h1>
        <p className="text-gray-200 lg:text-gray-300 text-[15px] lg:text-base mb-6 lg:mb-0 w-[95%] lg:w-full leading-relaxed">
          Experience the warmth of freshly baked artisan bread and handcrafted
          pastries, made with traditional techniques every single morning.
        </p>
        <div className="mt-2 lg:mt-5 flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-10">
          <button className="bg-[#F4AF25] w-full lg:w-auto py-3.5 lg:py-2.5 px-7 cursor-pointer rounded-xl font-bold text-lg lg:text-base shadow-lg shadow-[#D46211]/20">
            Shop Now
          </button>
          <button className="hidden lg:block bg-white/10 backdrop-blur-md py-2.5 px-7 cursor-pointer rounded-2xl font-bold">
            Our Story
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
