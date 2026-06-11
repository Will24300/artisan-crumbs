import { Link } from "react-router-dom";
import { dailySpecialData } from "../data";

function DailySpecial() {
  return (
    <section className="bg-[#f8f8f8] -mx-15 mb-20 p-15">
      <h2 className="text-[#F4AF25] font-bold text-[14px]">
        FRESH FROM THE OVEN
      </h2>
      <div className="flex justify-between items-center">
        <h1 className="text-[36px] font-bold">Daily Specials</h1>
        <Link to="shop" className="text-[#F4AF25] font-bold text-[16px]">
          View All items
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-15 mt-10">
        {dailySpecialData.map((product) => (
          <div key={product.id}>
            <div
              className="relative bg-no-repeat bg-cover bg-center h-100  rounded-2xl"
              style={{ backgroundImage: `url(${product.image})` }}
            >
              {product.tag && (
                <h3 className="absolute top-5 right-5 bg-[#F4AF25] text-black font-semibold px-3 text-[12px] rounded-2xl">
                  {product.tag}
                </h3>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mt-3">
                <h2 className="text-[20px] font-bold">{product.name}</h2>
                <p className="text-[18px] text-[#F4AF25] font-bold">
                  ${product.price}
                </p>
              </div>
              <p className="text-[#64748B] text-[14px]">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DailySpecial;
