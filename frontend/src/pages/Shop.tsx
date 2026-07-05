import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addToCart } from "../features/cart";
import { toast } from "react-toastify";

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

export type CategoryFilter = string;

interface ShopProps {
  activeFilter?: CategoryFilter;
  onFilterChange?: (category: CategoryFilter) => void;
  onAddToCart?: (productId: string | number) => void;
}

export const Shop: React.FC<ShopProps> = ({
  activeFilter: propActiveFilter,
  onFilterChange: propOnFilterChange,
  onAddToCart: propOnAddToCart,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get filter from URL params or use default
  const filterFromUrl = (searchParams.get("filter") as CategoryFilter) || "all";
  const activeFilter = propActiveFilter ?? filterFromUrl;

  // Update URL when filter changes
  const onFilterChange =
    propOnFilterChange ??
    ((filter: CategoryFilter) => {
      setSearchParams({ filter });
    });

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Unable to fetch products");
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
      .catch(() => setError("Error loading products. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  // Use Redux for cart if callback not provided
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <div className="mb-9">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
          Our Bakery <span className="text-[#F59E0B]">Fresh</span> Daily
        </h1>

        <div className="flex justify-between items-end flex-wrap gap-4">
          <p className="text-sm text-[#64748B] max-w-full sm:max-w-75 leading-relaxed">
            Handcrafted with organic flour and local ingredients. Experience the
            art of traditional baking.
          </p>

          {/* Render Filter Buttons dynamically from your dataset */}
          <div className="flex gap-2 flex-wrap">
            {filterCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onFilterChange(cat.value)}
                className={`py-1.5 px-4 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  activeFilter === cat.value
                    ? "bg-[#F59E0B] text-gray-900"
                    : "bg-[#F1F5F9] text-[#334155] hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Product Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="col-span-full text-center py-10 text-red-500">{error}</div>
        ) : displayedProducts.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">No products available.</div>
        ) : (
          displayedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative h-80 lg:h-48 w-full bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {/* Highlight special items if active category is Favorite */}
                {activeFilter === "Favorite" && (
                  <span className="absolute top-2.5 left-2.5 bg-[#F59E0B] text-amber-950 text-[10px] font-bold py-0.5 px-2 rounded uppercase tracking-wider">
                    Fav
                  </span>
                )}
                {/* Out of Stock Badge */}
                {product.stock === 0 && (
                  <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold py-0.5 px-2 rounded uppercase tracking-wider">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Body Content Container */}
              <div className="p-3.5 flex flex-col grow justify-between">
                <div>
                  <div className="flex justify-between items-baseline gap-2 mb-1.5">
                    <span className="font-bold text-sm text-gray-900 line-clamp-1">
                      {product.name}
                    </span>
                    <span className="text-[#F59E0B] font-bold text-sm">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-2">
                    {product.description}
                  </p>
                  {product.stock > 0 && (
                    <p className="text-xs text-gray-500 mb-4">{`${product.stock} in stock`}</p>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onAddToCart(product._id)}
                  disabled={product.stock === 0}
                  className={`w-full rounded-full py-2.5 text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  <ShoppingCart size={14} />
                  {product.stock === 0 ? "Unavailable" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Shop;
