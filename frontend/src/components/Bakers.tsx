import { bakersData } from "../data";

function Bakers() {
  return (
    <section className="py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-6 bg-[#D46211]" />
            <h2 className="text-[#D46211] font-bold text-[13px] tracking-[0.15em] uppercase">
              The Team
            </h2>
          </div>
          <h1 className="font-serif text-[32px] sm:text-[40px] font-bold text-[#241812] leading-tight">
            Meet the Bakers
          </h1>
        </div>
        <p className="text-[#64748B] text-[16px] max-w-2xl">
          Meet the passionate hands behind every loaf and pastry that leaves our ovens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-16 md:gap-x-10 mt-14">
        {bakersData.map((baker, i) => (
          <div key={baker.id} className="group">
            <div className="relative">
              <div
                className="relative bg-no-repeat bg-cover bg-center h-[420px] rounded-2xl overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${baker.image})` }}
              />
              {/* Kraft-tag signature element */}
              <div
                className={`absolute -bottom-5 left-6 bg-[#FBF6EE] border border-dashed border-[#D46211]/50 
                  px-4 py-2 rounded-[3px] shadow-md rotate-[-4deg] transition-transform duration-500
                  group-hover:rotate-0 group-hover:-translate-y-1
                  ${i % 2 === 0 ? "rotate-[-4deg]" : "rotate-[3deg]"}`}
              >
                <p className="text-[#D46211] font-semibold text-[14px] whitespace-nowrap">
                  {baker.speciality}
                </p>
              </div>
            </div>

            <div className="mt-9 px-1">
              <h2 className="font-serif text-[22px] font-bold text-[#241812]">
                {baker.name}
              </h2>
              <span className="block mt-1 h-[2px] w-6 bg-[#D46211]/60" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Bakers;