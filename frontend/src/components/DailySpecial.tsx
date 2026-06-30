import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart";
import { dailySpecialData } from "../data";

interface RootState {
  auth: {
    user: {
      name: string;
    } | null;
  };
}

function DailySpecial() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const handleAdd = (productId: string | number) => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    dispatch(addToCart(productId));
  };

  return (
    <section className="bg-[#F8F7F5] -mx-15 mb-20 p-15">
      <h2 className="text-[#F4AF25] font-bold text-[14px]">
        FRESH FROM THE OVEN
      </h2>
      <div className="flex justify-between items-center">
        <h1 className="text-[36px] font-bold">Daily Specials</h1>
        <Link to="shop" className="text-[#F4AF25] font-bold text-[16px]">
          View All items
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        {dailySpecialData.map((product) => (
          <div key={product.id}>
            <div
              className="relative group bg-no-repeat bg-cover bg-center h-80 sm:h-96 rounded-2xl"
              style={{ backgroundImage: `url(${product.image})` }}
            >
              {product.tag && (
                <h3 className="absolute top-5 right-5 bg-[#F4AF25] text-black font-semibold px-3 text-[12px] rounded-2xl">
                  {product.tag}
                </h3>
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => handleAdd(product.id)}
                  className="opacity-0 group-hover:opacity-100 bg-[#F59E0B] text-white px-4 py-2 rounded-full font-semibold transition-opacity"
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to cart
                </button>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mt-3">
                <h2 className="text-[20px] font-bold">{product.name}</h2>
                <p className="text-[18px] text-[#F4AF25] font-bold">
                  ${product.price.toFixed(2)}
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
