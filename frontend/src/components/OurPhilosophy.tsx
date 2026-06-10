import checkIcon from "../assets/check-icon.png";
import bakerHands from "../assets/baker-hands.jpg";

function OurPhilosophy() {
  return (
    <section className="flex justify-between my-25 gap-15  ">
      <div className="py-10 w-2/4">
        <img src={bakerHands} alt="baker hands" className="rounded-4xl" />
      </div>
      <div className="w-2/4 flex flex-col gap-7">
        <h3 className="text-[#F4AF25] font-bold text-[14px]">OUR PHILOSOPHY</h3>
        <h2 className="text-[48px] font-bold leading-12">
          Slow Fermented, Heartfully Crafted
        </h2>
        <p className="text-[18px] text-[#475569]">
          We believe that great bread can't be rushed. That's why we use
          traditional long-fermentation methods that take up to 48 hours. This
          process develops deeper flavors, better texture, and makes our bread
          easier to digest.
        </p>
        <div>
          <p className="flex justify-start items-center gap-2">
            <img src={checkIcon} alt="check icon" />
            <span className="text-[#334155] text-[16px]">
              100% Natural Starters
            </span>
          </p>
          <p className="flex justify-start items-center gap-2 my-3">
            <img src={checkIcon} alt="check icon" />
            <span className="text-[#334155] text-[16px]">
              No Artificial Additives
            </span>
          </p>
          <p className="flex justify-start items-center gap-2">
            <img src={checkIcon} alt="check icon" />
            <span className="text-[#334155] text-[16px]">
              Locally Sourced Grains
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default OurPhilosophy;
