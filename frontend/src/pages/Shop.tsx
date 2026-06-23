import React, { useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { addToCart } from "../features/cart";
import { data } from "../data";

export type CategoryFilter =
  | "all"
  | "Cake"
  | "Muffins"
  | "Croissant"
  | "Bread"
  | "Tart"
  | "Favorite";

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

  // Get filter from URL params or use default
  const filterFromUrl = (searchParams.get("filter") as CategoryFilter) || "all";
  const activeFilter = propActiveFilter ?? filterFromUrl;

  // Update URL when filter changes
  const onFilterChange =
    propOnFilterChange ??
    ((filter: CategoryFilter) => {
      setSearchParams({ filter });
    });

  // Use Redux for cart if callback not provided
  const dispatch = useDispatch();
  const onAddToCart =
    propOnAddToCart ??
    ((productId: string | number) => {
      dispatch(addToCart(productId));
    });

  console.log("Data loaded:", data);
  console.log("Categories:", data?.categories);
  console.log("Active filter:", activeFilter);
  // 1. Get unique categories dynamically from your data structure
  const filterCategories = useMemo(() => {
    const list: { label: string; value: CategoryFilter }[] = [
      { label: "All Items", value: "all" },
    ];

    data.categories.forEach((cat) => {
      list.push({ label: cat.name, value: cat.name as CategoryFilter });
    });

    return list;
  }, []);

  // 2. Derive the visible products based on the active filter state
  const displayedProducts = useMemo(() => {
    if (activeFilter === "all") {
      // Flattens all product arrays into one single list
      return data.categories.flatMap((cat) => cat.products);
    }

    // Find specific category matching the current active string
    const targetCategory = data.categories.find(
      (cat) => cat.name === activeFilter,
    );
    return targetCategory ? targetCategory.products : [];
  }, [activeFilter]);

  return (
    <section className="py-9 px-10">
      {/* Hero Header Area */}
      <div className="mb-9">
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
          Our Bakery <span className="text-[#F59E0B]">Fresh</span> Daily
        </h1>

        <div className="flex justify-between items-end flex-wrap gap-4">
          <p className="text-sm text-[#64748B] max-w-[300px] leading-relaxed">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[18px]">
        {displayedProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative h-[180px] w-full bg-gray-100 overflow-hidden">
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
            </div>

            {/* Body Content Container */}
            <div className="p-3.5 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex justify-between items-baseline gap-2 mb-1.5">
                  <span className="font-bold text-sm text-gray-900 line-clamp-1">
                    {product.name}
                  </span>
                  <span className="text-[#F59E0B] font-bold text-sm">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onAddToCart(product.id)}
                className="w-full bg-gray-900 text-white rounded-full py-2.5 text-xs font-medium cursor-pointer transition-colors hover:bg-gray-800 flex items-center justify-center gap-1.5"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Shop;
