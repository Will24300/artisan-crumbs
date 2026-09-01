import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ShoppingCart, PackageSearch, AlertTriangle, Heart, Star, MessageSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addToCart } from "../features/cart";
import { fetchProducts, type ApiProduct } from "../features/products";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { API_BASE } from "../utils/api";
import { ProductReviewsModal } from "../components/ProductReviewsModal";

interface RootState {
  auth: {
    user: { id: string; role?: string } | null;
  };
  products: {
    items: ApiProduct[];
    loading: boolean;
    error: string | null;
    loaded: boolean;
  };
}

export type CategoryFilter = string;

interface ShopProps {
  activeFilter?: CategoryFilter;
  onFilterChange?: (category: CategoryFilter) => void;
  onAddToCart?: (productId: string | number) => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

export const Shop: React.FC<ShopProps> = ({
  activeFilter: propActiveFilter,
  onFilterChange: propOnFilterChange,
  onAddToCart: propOnAddToCart,
}) => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { items: products, loading, error, loaded } = useSelector(
    (state: RootState) => state.products
  );

  // Reviews Summary Map: { [productId]: { averageRating, count } }
  const [reviewsSummary, setReviewsSummary] = useState<Record<string, { averageRating: number; count: number }>>({});
  // Selected product for reviews modal
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<ApiProduct | null>(null);

  const fetchReviewsSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/summary`);
      if (res.ok) {
        const json = await res.json();
        setReviewsSummary(json);
      }
    } catch {
      // Ignore background summary error
    }
  }, []);

  useEffect(() => {
    fetchReviewsSummary();
  }, [fetchReviewsSummary]);

  const filterFromUrl = (searchParams.get("filter") as CategoryFilter) || "all";
  const activeFilter = propActiveFilter ?? filterFromUrl;

  const onFilterChange =
    propOnFilterChange ??
    ((filter: CategoryFilter) => {
      setSearchParams({ filter });
    });

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchProducts());
    }
  }, [dispatch, loaded]);

  const authUser = useSelector((state: RootState) => state.auth.user);

  React.useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  const onAddToCart =
    propOnAddToCart ??
    ((productId: string | number) => {
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
    });

  const filterCategories = useMemo(() => {
    const categories = Array.from(new Set(products.map((product) => product.category)));
    return [
      { label: "All Items", value: "all" },
      ...categories.map((category) => ({ label: category, value: category as CategoryFilter })),
    ];
  }, [products]);

  const displayedProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }
    if (activeFilter === "Favorite") {
      return products.filter((product) => product.tags?.includes("favorite"));
    }
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter, products]);

  return (
    <section className="py-9 px-4 sm:px-6 lg:px-10">
      {/* Hero Header Area */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-6 bg-[#D46211]" />
          <span className="text-[#D46211] font-bold text-[13px] tracking-[0.15em] uppercase">
            The Shop
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241812] dark:text-stone-100 leading-tight mb-2">
          Our Bakery <span className="text-[#D46211]">Fresh</span> Daily
        </h1>

        <div className="flex justify-between items-end flex-wrap gap-4 mt-4">
          <p className="text-sm text-[#64748B] dark:text-stone-400 max-w-full sm:max-w-75 leading-relaxed">
            Handcrafted with organic flour and local ingredients. Experience the
            art of traditional baking.
          </p>

          <div className="flex gap-2 flex-wrap">
            {filterCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onFilterChange(cat.value)}
                className={`py-1.5 px-4 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  activeFilter === cat.value
                    ? "bg-[#D46211] text-white"
                    : "bg-[#F8F7F5] dark:bg-stone-800 text-[#475569] dark:text-stone-400 hover:bg-[#FFF4EB] dark:hover:bg-[#D46211]/10 hover:text-[#D46211]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {!loading && !error && (
          <p className="text-xs text-[#94A3B8] dark:text-stone-500 mt-4">
            Showing {displayedProducts.length} {displayedProducts.length === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      {/* Product Grid Layout */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-stone-800 animate-pulse"
            >
              <div className="h-80 lg:h-48 bg-gray-200 dark:bg-stone-800" />
              <div className="p-3.5 space-y-2.5">
                <div className="h-3 w-12 bg-gray-200 dark:bg-stone-700 rounded" />
                <div className="h-3.5 w-3/4 bg-gray-200 dark:bg-stone-700 rounded" />
                <div className="h-2.5 w-full bg-gray-200 dark:bg-stone-700 rounded" />
                <div className="h-8 w-full bg-gray-200 dark:bg-stone-700 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
          <AlertTriangle size={28} className="text-red-400" />
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-[#64748B] dark:text-stone-400 text-sm">Refresh the page to try again.</p>
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
          <PackageSearch size={28} className="text-[#64748B] dark:text-stone-500" />
          <p className="text-[#241812] dark:text-stone-200 font-medium">No products found</p>
          <p className="text-[#64748B] dark:text-stone-400 text-sm">Try a different category.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayedProducts.map((product) => {
            const summary = reviewsSummary[product._id];
            const avg = summary?.averageRating;
            const count = summary?.count || 0;

            return (
              <motion.div
                key={product._id}
                variants={cardVariants}
                className="group bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all"
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                {/* Image Container */}
                <div className="relative">
                  <div className="h-72 sm:h-64 w-full bg-gray-100 dark:bg-stone-800 overflow-hidden rounded-t-2xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {activeFilter === "Favorite" && (
                      <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[#F59E0B] text-amber-950 text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider shadow">
                        <Heart size={10} fill="currentColor" />
                        Fav
                      </span>
                    )}

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
                  <div className="absolute -bottom-3.5 left-3.5 bg-white dark:bg-stone-800 border-2 border-[#D46211] rounded-full px-3 py-1 shadow-md rotate-[-3deg] transition-transform duration-300 group-hover:rotate-0">
                    <span className="text-[#D46211] font-bold text-xs whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Body Content Container */}
                <div className="px-3.5 pt-6 pb-3.5 flex flex-col grow justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D46211] text-[10px] font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                      <button
                        onClick={() => setSelectedReviewProduct(product)}
                        className="text-[11px] font-semibold text-stone-400 hover:text-[#D46211] dark:hover:text-[#F2A469] flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare size={12} /> Reviews
                      </button>
                    </div>
                    <h2 className="font-bold text-sm text-[#241812] dark:text-stone-100 line-clamp-1 mt-0.5">
                      {product.name}
                    </h2>
                    <p className="text-xs text-[#64748B] dark:text-stone-400 line-clamp-2 leading-relaxed mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => onAddToCart(product._id)}
                      disabled={product.stock === 0}
                      className={`w-full rounded-full py-2.5 text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                        product.stock === 0
                          ? "bg-gray-100 dark:bg-stone-800 text-gray-400 dark:text-stone-500 cursor-not-allowed"
                          : "bg-[#FFF4EB] dark:bg-[#D46211]/10 text-[#D46211] hover:bg-[#D46211] hover:text-white shadow-sm"
                      }`}
                    >
                      <ShoppingCart size={14} />
                      {product.stock === 0 ? "Unavailable" : "Add to Cart"}
                    </button>
                  </div>
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
};

export default Shop;