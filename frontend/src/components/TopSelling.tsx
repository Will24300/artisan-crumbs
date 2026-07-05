import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart";
import { motion, useInView } from "framer-motion";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";

interface RootState {
  auth: {
    user: { id: string; role?: string } | null;
  };
}

interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags?: string[];
  stock: number;
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  whileInView: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

function TopSelling() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products/top-selling")
      .then((res) => {
        if (!res.ok) throw new Error("Unable to fetch top-selling products");
        return res.json();
      })
      .then((data: ApiProduct[]) => {
        setProducts((data || []).map((product) => {
          const rawStock = (product as any).stock ?? (product as any).countInStock ?? (product as any).quantity ?? 0;
          return {
            ...product,
            stock: Number(rawStock) || 0,
          } as ApiProduct;
        }));
        setError(null);
      })
      .catch(() => setError("Error loading top-selling products."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (productId: string) => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    if (authUser.role === "admin") {
      toast.error("Administrators cannot place orders.");
      return;
    }
    const product = products.find((p) => p._id === productId);
    if (!product || product.stock === 0) {
      toast.error("This product is out of stock.");
      return;
    }
    dispatch(addToCart(productId));
    toast.success(`${product.name} added to your cart!`, {
      autoClose: 3000,
      onClick: () => navigate("/cart"),
    });
  };

  return (
    <section className="bg-[#F8F7F5] -mx-15 mb-20 p-15" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[#D46211] font-bold text-[14px]">
          CUSTOMER FAVORITES
        </h2>
        <div className="flex justify-between items-center">
          <h1 className="text-[36px] font-bold">Top Selling</h1>
          <Link to="shop" className="text-[#D46211] font-bold text-[16px]">
            View All items
          </Link>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading top products...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No products available.</div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-10"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div 
              key={product._id} 
              variants={fadeInUp}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col justify-between"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {/* Image Container */}
              <div className="relative h-80 lg:h-80 w-full bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {/* Out of Stock Badge */}
                {product.stock === 0 && (
                  <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold py-0.5 px-2 rounded uppercase tracking-wider">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Body Content Container */}
              <div className="px-3.5 py-5 flex flex-col grow justify-between">
                <div>
                  <div className="flex justify-between items-baseline gap-2 mb-1.5">
                    <span className="font-bold text-sm text-gray-900 line-clamp-1 col-span-2">
                      {product.name}
                    </span>
                    <span className="text-[#D46211] font-bold text-sm shrink-0">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-2">
                    {product.description}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleAdd(product._id)}
                  disabled={product.stock === 0}
                  className={`w-full rounded-full py-2.5 text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#FFF4EB] text-[#D46211] hover:bg-[#D46211] hover:text-white"
                  }`}
                >
                  <ShoppingCart size={14} />
                  {product.stock === 0 ? "Unavailable" : "Add to Cart"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

export default TopSelling;
