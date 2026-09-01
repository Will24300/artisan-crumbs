import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart";
import { motion, useInView } from "framer-motion";
import { toast } from "react-toastify";
import { ShoppingCart, PackageSearch, AlertTriangle, ArrowUpRight, Star, MessageSquare } from "lucide-react";
import { fetchTopSelling, type ApiProduct } from "../features/products";
import { API_BASE } from "../utils/api";
import { ProductReviewsModal } from "./ProductReviewsModal";

interface RootState {
  auth: {
    user: { id: string; role?: string } | null;
  };
  products: {
    items: ApiProduct[];
    topSelling: ApiProduct[];
    loading: boolean;
    topSellingLoading: boolean;
    error: string | null;
    loaded: boolean;
    topSellingLoaded: boolean;
  };
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
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const {
    topSelling: products,
    topSellingLoading: loading,
    topSellingLoaded,
    error,
  } = useSelector((state: RootState) => state.products);

  const [reviewsSummary, setReviewsSummary] = useState<Record<string, { averageRating: number; count: number }>>({});
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<ApiProduct | null>(null);

  const fetchReviewsSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/summary`);
      if (res.ok) {
        const json = await res.json();
        setReviewsSummary(json);
      }
    } catch {
      // Ignore summary errors
    }
  }, []);

  useEffect(() => {
    fetchReviewsSummary();
  }, [fetchReviewsSummary]);

  useEffect(() => {
    if (!topSellingLoaded) {
      dispatch(fetchTopSelling());
    }
  }, [dispatch, topSellingLoaded]);

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
    <section
      className="bg-[#F8F7F5] dark:bg-[#12100f] -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-15 px-4 sm:px-6 md:px-10 lg:px-15 py-15 transition-colors duration-300"
      ref={ref}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-6 bg-[#D46211]" />
          <h2 className="text-[#D46211] font-bold text-[13px] tracking-[0.15em] uppercase">
            Customer Favorites
          </h2>
        </div>
        <div className="flex justify-between items-end gap-4">
          <h1 className="font-serif text-[28px] xs:text-[32px] sm:text-[36px] font-bold text-[#241812] dark:text-stone-100">
            Top Selling
          </h1>
          <Link
            to="shop"
            className="group hidden sm:flex items-center gap-1 text-[#D46211] font-bold text-[15px] shrink-0"
          >
            View All items
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10 mt-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-stone-800 animate-pulse"
            >
              <div className="h-72 bg-gray-200 dark:bg-stone-850" />
              <div className="px-3.5 py-5 space-y-3">
                <div className="h-3 w-16 bg-gray-200 dark:bg-stone-750 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-stone-750 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-stone-750 rounded" />
                <div className="h-9 w-full bg-gray-200 dark:bg-stone-750 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <AlertTriangle size={28} className="text-red-400" />
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-[#64748B] dark:text-stone-400 text-sm">Refresh the page to try again.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <PackageSearch size={28} className="text-[#64748B] dark:text-stone-500" />
          <p className="text-[#241812] dark:text-stone-200 font-medium">No products yet</p>
          <p className="text-[#64748B] dark:text-stone-400 text-sm">Check back soon — new bakes are added often.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10 mt-10"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => {
            const summary = reviewsSummary[product._id];
            const avg = summary?.averageRating;
            const count = summary?.count || 0;

            return (
              <motion.div
                key={product._id}
                variants={fadeInUp}
                className="group bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-stone-800 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Image Container */}
                <div className="relative">
                  <div className="h-90 w-full bg-gray-100 dark:bg-stone-800 overflow-hidden rounded-t-2xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Interactive Rating Badge top right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReviewProduct(product);
                      }}
                      className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-900 dark:text-stone-100 text-[11px] font-bold py-1 px-2.5 rounded-full shadow-md hover:scale-105 transition-transform border border-amber-300/50"
                      title="View & Submit Reviews"
                    >
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{avg ? avg.toFixed(1) : "New"}</span>
                      {count > 0 && (
                        <span className="text-stone-400 font-normal">({count})</span>
                      )}
                    </button>

                    {product.stock === 0 && (
                      <span className="absolute bottom-2.5 right-2.5 bg-[#241812]/90 backdrop-blur-sm text-white text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Price sticker */}
                  <div className="absolute -bottom-4 left-4 bg-white dark:bg-stone-800 border-2 border-[#D46211] rounded-full px-3.5 py-1.5 shadow-md rotate-[-3deg] transition-transform duration-300 group-hover:rotate-0">
                    <span className="text-[#D46211] font-bold text-sm whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Body Content Container */}
                <div className="px-3.5 pt-6 pb-5 flex flex-col grow justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D46211] text-[11px] font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                      <button
                        onClick={() => setSelectedReviewProduct(product)}
                        className="text-[11px] font-semibold text-stone-400 hover:text-[#D46211] dark:hover:text-[#F2A469] flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare size={12} /> Reviews
                      </button>
                    </div>
                    <h3 className="font-bold text-[15px] text-[#241812] dark:text-stone-100 line-clamp-1 mt-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-stone-400 line-clamp-2 leading-relaxed mt-1.5 mb-4">
                      {product.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAdd(product._id)}
                    disabled={product.stock === 0}
                    className={`w-full rounded-full py-2.5 text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                      product.stock === 0
                        ? "bg-gray-100 dark:bg-stone-800 text-gray-400 dark:text-stone-500 cursor-not-allowed"
                        : "bg-[#FFF4EB] dark:bg-[#D46211]/15 text-[#D46211] hover:bg-[#D46211] hover:text-white"
                    }`}
                  >
                    <ShoppingCart size={14} />
                    {product.stock === 0 ? "Unavailable" : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Product Reviews & Photo Gallery Modal */}
      {selectedReviewProduct && (
        <ProductReviewsModal
          isOpen={!!selectedReviewProduct}
          productId={selectedReviewProduct._id}
          productName={selectedReviewProduct.name}
          productImage={selectedReviewProduct.image}
          productPrice={selectedReviewProduct.price}
          onClose={() => setSelectedReviewProduct(null)}
          onReviewSubmitted={() => {
            fetchReviewsSummary();
          }}
        />
      )}
    </section>
  );
}

export default TopSelling;