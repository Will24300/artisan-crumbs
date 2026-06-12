import { bakersData } from "../data";

function Bakers() {
  return (
    <section className="py-10">
      <h2 className="text-[#F4AF25] font-bold text-[14px]">THE TEAM</h2>
      <div className="flex justify-between items-center">
        <h1 className="text-[36px] font-bold">Meet the Bakers</h1>
        <p className="text-[#64748B] text-[16px] ">
          Meet the passionate hands behind every loaf and pastry <br /> that
          leaves our ovens.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-15 mt-10">
        {bakersData.map((baker) => (
          <div key={baker.id}>
            <div
              className="relative bg-no-repeat bg-cover bg-center h-100  rounded-2xl"
              style={{ backgroundImage: `url(${baker.image})` }}
            ></div>
            <div className="mt-3">
              <h2 className="text-[20px] font-bold">{baker.name}</h2>
              <p className="text-[#F4AF25] font-medium text-[16px]">
                {baker.speciality}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Bakers;
