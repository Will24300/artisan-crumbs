import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  removeAllFromCart,
} from "../features/cart";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { X, Plus, Minus, ShoppingBag, AlertTriangle, ArrowLeft, Clock, CheckCircle2, Package, Utensils, Truck, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { fetchProducts, type ApiProduct } from "../features/products";
import { API_BASE } from "../utils/api";
import { PaymentModal } from "./PaymentModal";
import { FulfillmentScheduler, type ScheduleSelection } from "./FulfillmentScheduler";

interface RootState {
  cart: {
    items: Array<{
      productId: string | number;
      quantity: number;
      customDetails?: string;
      customName?: string;
      customPrice?: number;
      customImage?: string;
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
  products: {
    items: ApiProduct[];
    loading: boolean;
    error: string | null;
    loaded: boolean;
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
  const dispatch = useDispatch<any>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  const { items: products, loading, error, loaded } = useSelector(
    (state: RootState) => state.products
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchProducts());
    }
  }, [dispatch, loaded]);

  const cartProducts = cartItems
    .map((cartItem) => {
      if (cartItem.customName || String(cartItem.productId).startsWith("custom-")) {
        return {
          _id: String(cartItem.productId),
          name: cartItem.customName || "Custom Celebration Cake",
          price: cartItem.customPrice || 38.0,
          quantity: cartItem.quantity,
          image: cartItem.customImage || "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop",
          customDetails: cartItem.customDetails || "",
          description: cartItem.customDetails || "Custom Bakery Creation",
          stock: 999,
        };
      }
      const product = products.find((p) => p._id === cartItem.productId);
      if (!product) return null;
      return { ...product, quantity: cartItem.quantity, customDetails: "" };
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
    const product = cartProducts.find((p) => p._id === productId);
    const cartItem = cartItems.find((item) => item.productId === productId);
    if (!product) return;
    if (cartItem && cartItem.quantity >= (product.stock || 999)) {
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Settings & Fulfillment state
  const [storeSettings, setStoreSettings] = useState<any>({
    freeDelivery: true,
    deliveryFee: 4.99,
    paypalEnabled: true,
    stripeEnabled: true,
    cashEnabled: false,
  });

  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">("delivery");
  const [pickupTime, setPickupTime] = useState<string>("As soon as possible (in 30 mins)");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [scheduleSelection, setScheduleSelection] = useState<ScheduleSelection | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStoreSettings(data);
          if (data.stripeEnabled) setPaymentMethod("card");
          else if (data.paypalEnabled) setPaymentMethod("paypal");
          else if (data.cashEnabled) setPaymentMethod("cash");
        }
      })
      .catch(() => {});
  }, []);

  const deliveryFeeAmount =
    fulfillmentType === "pickup" || storeSettings.freeDelivery
      ? 0
      : Number(storeSettings.deliveryFee) || 0;

  const taxAmount = totalPrice * 0.1;
  const grandTotal = totalPrice + taxAmount + deliveryFeeAmount;

  const handleOpenPaymentModal = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (cartProducts.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (fulfillmentType === "delivery" && !deliveryAddress.trim()) {
      toast.error("Please enter a valid delivery address.");
      return;
    }

    if (!scheduleSelection) {
      toast.error("Please select a pickup/delivery date and time slot.");
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handleFinalizeOrder = async (paymentDetails: {
    paymentMethod: string;
    paymentStatus: "paid" | "pending";
    transactionId: string;
  }) => {
    const payload = {
      items: cartProducts.map((p) => ({
        productId: p._id,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        customDetails: p.customDetails || "",
      })),
      totalAmount: grandTotal,
      fulfillmentType,
      pickupTime: fulfillmentType === "pickup" ? pickupTime : "",
      deliveryAddress: fulfillmentType === "delivery" ? deliveryAddress : "",
      deliveryFee: deliveryFeeAmount,
      scheduledDate: scheduleSelection?.scheduledDate || "",
      timeSlot: scheduleSelection?.timeSlot || "",
      paymentMethod: paymentDetails.paymentMethod,
      paymentStatus: paymentDetails.paymentStatus,
      transactionId: paymentDetails.transactionId,
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
      setIsPaymentModalOpen(false);
    } catch {
      toast.error("Unable to connect to the server.");
    }
  };

  // const { darkMode } = useTheme();

  return (
    <section className="py-9 px-4 sm:px-6 lg:px-10 min-h-screen bg-[#F9F9F8] dark:bg-[#0f0d0c] transition-colors duration-300">
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handleFinalizeOrder}
        grandTotal={grandTotal}
        fulfillmentType={fulfillmentType}
        initialMethod={paymentMethod}
      />
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
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 p-6 h-fit sticky top-4 shadow-[0_18px_48px_rgba(36,24,18,0.05)] space-y-5">
                <h2 className="font-serif font-bold text-lg text-[#241812] dark:text-stone-100 border-b border-gray-100 dark:border-stone-850 pb-3">
                  Order Summary
                </h2>

                {/* Fulfillment Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#64748B] dark:text-stone-400 uppercase tracking-wider mb-2">
                    Fulfillment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType("delivery")}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        fulfillmentType === "delivery"
                          ? "bg-[#FFF4EB] dark:bg-[#D46211]/20 border-[#D46211] text-[#D46211]"
                          : "border-gray-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-gray-50 dark:hover:bg-stone-850"
                      }`}
                    >
                      <Truck size={14} /> Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentType("pickup")}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        fulfillmentType === "pickup"
                          ? "bg-[#FFF4EB] dark:bg-[#D46211]/20 border-[#D46211] text-[#D46211]"
                          : "border-gray-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-gray-50 dark:hover:bg-stone-850"
                      }`}
                    >
                      <Package size={14} /> Pickup
                    </button>
                  </div>
                </div>

                {/* Conditional Delivery Address Input */}
                {fulfillmentType === "delivery" && (
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] dark:text-stone-400 uppercase tracking-wider mb-1.5">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Street address, Apt, City..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-stone-700 text-xs outline-none bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-[#D46211] dark:focus:border-[#D46211]"
                      />
                    </div>
                  </div>
                )}

                {/* Baking Batch Scheduler */}
                <div className="pt-1 border-t border-gray-100 dark:border-stone-850">
                  <FulfillmentScheduler
                    value={scheduleSelection}
                    onChange={setScheduleSelection}
                  />
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-3 border-t border-gray-100 dark:border-stone-850 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-stone-400">Subtotal</span>
                    <span className="font-semibold text-[#241812] dark:text-stone-200">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-stone-400">
                      Delivery {fulfillmentType === "pickup" ? "(Pickup)" : ""}
                    </span>
                    <span className={`font-semibold ${deliveryFeeAmount === 0 ? "text-emerald-600" : "text-[#241812] dark:text-stone-200"}`}>
                      {deliveryFeeAmount === 0 ? "Free" : `$${deliveryFeeAmount.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-stone-400">Tax (10%)</span>
                    <span className="font-semibold text-[#241812] dark:text-stone-200">
                      ${taxAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 dark:border-stone-850">
                  <span className="font-bold text-sm text-[#241812] dark:text-stone-100">Total</span>
                  <span className="font-serif font-bold text-[#D46211] text-2xl">
                    ${grandTotal.toFixed(2)}
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
                    handleOpenPaymentModal();
                  }}
                  className="cursor-pointer w-full bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold py-3 rounded-full transition-colors shadow-sm"
                >
                  Proceed to Payment
                </button>
                <Link
                  to="/shop"
                  className="cursor-pointer block text-center text-[#475569] dark:text-stone-300 font-semibold py-2 text-xs hover:bg-[#F8F7F5] dark:hover:bg-stone-800 rounded-full transition-colors"
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