import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  removeAllFromCart,
} from "../features/cart";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { X, Plus, Minus, ShoppingBag, AlertTriangle, ArrowLeft, Clock, CheckCircle2, Package, Utensils } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { API_BASE } from "../utils/api";

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

interface RootState {
  cart: {
    items: Array<{
      productId: string | number;
      quantity: number;
    }>;
  };
  auth: {
    token: string | null;
    user: {
      id: string;
      role?: string;
      name: string;
      email: string;
    } | null;
  };
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to fetch products");
        return res.json();
      })
      .then((data: ApiProduct[]) => {
        setProducts((data || []).map((product) => {
          const rawStock = (product as any).stock ?? (product as any).countInStock ?? (product as any).quantity ?? 0;
          return { ...product, stock: Number(rawStock) || 0 } as ApiProduct;
        }));
        setError(null);
      })
      .catch(() => setError("Couldn't load your cart details."))
      .finally(() => setLoading(false));
  }, []);

  const cartProducts = cartItems
    .map((cartItem) => {
      const product = products.find((p) => p._id === cartItem.productId);
      if (!product) return null;
      return { ...product, quantity: cartItem.quantity };
    })
    .filter((item) => item !== null);

  const totalPrice = cartProducts.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 1),
    0,
  );

  const handleRemove = (productId: string | number) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncrement = (productId: string | number) => {
    const product = products.find((p) => p._id === productId);
    const cartItem = cartItems.find((item) => item.productId === productId);
    if (!product) return;
    if (cartItem && cartItem.quantity >= product.stock) {
      toast.error("Cannot add more than available stock.");
      return;
    }
    dispatch(incrementQuantity(productId));
  };

  const handleDecrement = (productId: string | number) => {
    dispatch(decrementQuantity(productId));
  };

  const handleClearCart = () => {
    dispatch(removeAllFromCart());
  };

  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  const handleCheckout = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (cartProducts.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const payload = {
      items: cartProducts.map((p) => ({
        productId: p._id,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount: totalPrice * 1.1,
    };

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to place order.");
        return;
      }

      const newOrder = await res.json();
      toast.success("Order placed successfully! 🥖");
      dispatch(removeAllFromCart());
      setCreatedOrder(newOrder);
    } catch {
      toast.error("Unable to connect to the server.");
    }
  };

  // const { darkMode } = useTheme();

  return (
    <section className="py-9 px-4 sm:px-6 lg:px-10 min-h-screen bg-[#F9F9F8] dark:bg-[#0f0d0c] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <Link
          to={`/shop?filter=${filter}`}
          className="group cursor-pointer inline-flex items-center gap-1.5 text-[#D46211] font-semibold text-sm mb-6"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to shop
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241812] dark:text-stone-100 mb-9">
          Shopping <span className="text-[#D46211]">Cart</span>
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-9">
            <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-5 border-b border-gray-100 dark:border-stone-850 last:border-b-0 animate-pulse">
                  <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-stone-800 shrink-0" />
                  <div className="flex-1 space-y-2.5 py-1">
                    <div className="h-3.5 w-1/3 bg-gray-200 dark:bg-stone-750 rounded" />
                    <div className="h-2.5 w-2/3 bg-gray-200 dark:bg-stone-750 rounded" />
                    <div className="h-6 w-24 bg-gray-200 dark:bg-stone-750 rounded-full mt-3" />
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden lg:block bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 h-64 animate-pulse" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800">
            <AlertTriangle size={28} className="text-red-400" />
            <p className="text-red-500 font-medium">{error}</p>
            <p className="text-[#64748B] dark:text-stone-400 text-sm">Refresh the page to try again.</p>
          </div>
        ) : cartProducts.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 px-6 bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF4EB] dark:bg-[#D46211]/15 mb-4">
              <ShoppingBag size={26} className="text-[#D46211]" />
            </span>
            <p className="font-serif text-xl font-bold text-[#241812] dark:text-stone-100 mb-1.5">Your cart is empty</p>
            <p className="text-[#64748B] dark:text-stone-400 text-sm mb-6 max-w-xs">
              Looks like you haven't added anything yet. Fresh bakes are waiting in the shop.
            </p>
            <Link
              to="/shop"
              className="cursor-pointer inline-block bg-[#D46211] hover:bg-[#b04f0b] text-white font-semibold py-2.5 px-6 rounded-full transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-9">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence initial={false}>
                  {cartProducts.map((item) => {
                    const nearLimit = (item?.quantity || 0) >= (item?.stock || 0);
                    return (
                      <motion.div
                        key={item?._id}
                        variants={itemVariants}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 p-5 border-b border-gray-100 dark:border-stone-850 last:border-b-0 items-center"
                      >
                        <img
                          src={item?.image}
                          alt={item?.name}
                          className="w-24 h-24 object-cover rounded-xl bg-gray-100 dark:bg-stone-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#241812] dark:text-stone-100 mb-1 truncate">
                            {item?.name}
                          </h3>
                          <p className="text-xs text-[#64748B] dark:text-stone-400 mb-3 line-clamp-1">
                            {item?.description}
                          </p>
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <span className="text-[#D46211] font-bold">
                              ${(item?.price || 0).toFixed(2)}
                            </span>

                            <div className="flex items-center gap-1 bg-[#F8F7F5] dark:bg-stone-800 rounded-full p-1">
                              <button
                                onClick={() => handleDecrement(item?._id || 0)}
                                className="cursor-pointer flex items-center justify-center w-7 h-7 hover:bg-white dark:hover:bg-stone-700 rounded-full transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} className="text-[#475569] dark:text-stone-300" />
                              </button>
                              <span className="text-sm font-bold text-[#241812] dark:text-stone-200 w-6 text-center">
                                {item?.quantity}
                              </span>
                              <button
                                onClick={() => handleIncrement(item?._id || 0)}
                                disabled={nearLimit}
                                className="cursor-pointer flex items-center justify-center w-7 h-7 hover:bg-white dark:hover:bg-stone-700 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} className="text-[#475569] dark:text-stone-300" />
                              </button>
                            </div>
                          </div>
                          {nearLimit && (
                            <p className="text-[11px] text-amber-600 font-medium mt-1.5">
                              Max available stock reached
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item?._id || 0)}
                          className="cursor-pointer text-[#94A3B8] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors p-2 rounded-full shrink-0"
                          aria-label={`Remove ${item?.name}`}
                        >
                          <X size={18} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              <button
                onClick={handleClearCart}
                className="cursor-pointer mt-4 text-red-500 font-semibold text-sm hover:text-red-600 transition-colors"
              >
                Clear cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 p-6 h-fit sticky top-4 shadow-[0_18px_48px_rgba(36,24,18,0.05)]">
                <h2 className="font-serif font-bold text-lg text-[#241812] dark:text-stone-100 mb-4">
                  Order summary
                </h2>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 dark:border-stone-850">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B] dark:text-stone-400">Subtotal</span>
                    <span className="font-semibold text-[#241812] dark:text-stone-200">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B] dark:text-stone-400">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B] dark:text-stone-400">Tax (10%)</span>
                    <span className="font-semibold text-[#241812] dark:text-stone-200">
                      ${(totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-bold text-[#241812] dark:text-stone-100">Total</span>
                  <span className="font-serif font-bold text-[#D46211] text-2xl">
                    ${(totalPrice * 1.1).toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!authUser) {
                      navigate("/login");
                      return;
                    }
                    if (authUser.role === "admin") {
                      toast.error("Administrators cannot place orders.");
                      return;
                    }
                    handleCheckout();
                  }}
                  className="cursor-pointer w-full bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold py-3 rounded-full transition-colors mb-3"
                >
                  Checkout
                </button>
                <Link
                  to="/shop"
                  className="cursor-pointer block text-center text-[#475569] dark:text-stone-300 font-semibold py-2.5 hover:bg-[#F8F7F5] dark:hover:bg-stone-800 rounded-full transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Placed & In Process Modal */}
      {createdOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-[#D46211] dark:text-amber-400 mb-2">
                <Clock className="w-9 h-9 animate-pulse" />
              </div>
              
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Status: In Process</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                Order Placed & In Process!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Your order has been received! Our bakers will review and accept your order shortly.
              </p>
            </div>

            {/* Timeline steps */}
            <div className="bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-stone-800 dark:text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1. Order Placed</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#D46211] dark:text-amber-400">
                <Clock className="w-4 h-4 animate-spin shrink-0 text-[#D46211]" />
                <span>2. Bakery Review & Acceptance (In Process...)</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-stone-400 dark:text-stone-500">
                <Utensils className="w-4 h-4 shrink-0" />
                <span>3. Baking & Order Preparation</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-stone-400 dark:text-stone-500">
                <Package className="w-4 h-4 shrink-0" />
                <span>4. Ready for Pickup</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-stone-400 dark:text-stone-500">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>5. Order Completed</span>
              </div>
            </div>

            {/* Order Details Snippet */}
            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 border-t border-b border-stone-100 dark:border-stone-800 py-3">
              <div className="flex justify-between">
                <span className="font-medium text-stone-500 dark:text-stone-400">Order ID:</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200">#{createdOrder._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-500 dark:text-stone-400">Total Items:</span>
                <span>{createdOrder.items?.reduce((sum: number, i: any) => sum + i.quantity, 0)} items</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-500 dark:text-stone-400">Total Amount:</span>
                <span className="font-bold text-[#D46211]">${Number(createdOrder.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCreatedOrder(null);
                  navigate("/account");
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold text-xs tracking-wide transition-colors cursor-pointer"
              >
                <Package className="w-4 h-4" />
                View Order History
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedOrder(null);
                  navigate("/shop");
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

export default Cart;