import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShoppingBag,
  User,
  Mail,
  Calendar,
  ChevronRight,
  AlertCircle,
  ChefHat,
  Truck,
  MapPin,
  CreditCard,
} from "lucide-react";
import { API_BASE } from "../utils/api";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "accepted" | "preparing" | "ready_for_pickup" | "completed" | "declined";
  fulfillmentType?: "pickup" | "delivery";
  pickupTime?: string;
  deliveryAddress?: string;
  deliveryFee?: number;
  paymentMethod?: string;
  createdAt: string;
}

interface RootState {
  auth: {
    token: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    } | null;
  };
}

function Account() {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (isManualRefresh = false) => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(`${API_BASE}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await response.json();
      setOrders(data || []);
      setError(null);
    } catch {
      setError("Unable to load order history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  if (!user) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F9F9F8] dark:bg-[#0f0d0c] transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-8 text-center shadow-lg"
        >
          <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#D46211] flex items-center justify-center mx-auto mb-4">
            <User size={28} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">Not Signed In</h1>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Please sign in to view your profile and track your order history.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D46211] hover:bg-[#b04f0b] text-white text-xs font-bold transition-colors"
          >
            Sign In to Account
          </Link>
        </motion.div>
      </section>
    );
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "accepted":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-450 shrink-0" />
            <span>Accepted</span>
          </div>
        );
      case "preparing":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
            <ChefHat size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Preparing & Baking 🥖</span>
          </div>
        );
      case "ready_for_pickup":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
            <Package size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Ready for Pickup 📦</span>
          </div>
        );
      case "completed":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
            <CheckCircle2 size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Completed ✅</span>
          </div>
        );
      case "declined":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900">
            <XCircle size={14} className="text-red-600 dark:text-red-400 shrink-0" />
            <span>Order Declined ❌</span>
          </div>
        );
      case "pending":
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
            <Clock size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span>In Process (Pending Acceptance)</span>
          </div>
        );
    }
  };

  return (
    <section className="min-h-screen py-10 px-4 sm:px-6 lg:px-10 bg-[#F9F9F8] dark:bg-[#0f0d0c] text-stone-800 dark:text-stone-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* User Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D46211] to-amber-600 text-white font-serif font-bold text-2xl flex items-center justify-center shadow-md shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-[#D46211] border border-orange-200 dark:border-orange-900">
                  {user.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-1">
                <Mail size={14} className="text-[#D46211]" /> {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-stone-100 dark:border-stone-800 pt-4 md:pt-0">
            <Link
              to="/shop"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#D46211] hover:bg-[#b04f0b] text-white text-xs font-bold transition-colors shadow-sm"
            >
              <ShoppingBag size={15} /> Order Bakes
            </Link>
          </div>
        </motion.div>

        {/* Order History Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#D46211]" />
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Order History & Live Status
            </h2>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin text-[#D46211]" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh Orders"}</span>
          </button>
        </div>

        {/* Order History List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-stone-200 dark:bg-stone-800 rounded" />
                  <div className="h-6 w-24 bg-stone-200 dark:bg-stone-800 rounded-full" />
                </div>
                <div className="h-12 w-full bg-stone-100 dark:bg-stone-850 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button
              onClick={() => fetchOrders()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D46211] text-white text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-10 text-center space-y-4 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#D46211] flex items-center justify-center mx-auto">
              <ShoppingBag size={32} />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">No Orders Yet</h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t placed any bakery orders yet. Explore our handcrafted sourdoughs, croissants, and cakes in the shop!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D46211] hover:bg-[#b04f0b] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Browse Shop & Order <ChevronRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {orders.map((order, index) => {
                const formattedDate = new Date(order.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-1">
                          <Calendar size={13} className="text-[#D46211]" /> {formattedDate}
                        </p>
                      </div>

                      <div className="self-start sm:self-auto">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Status Message Info */}
                    {order.status === "pending" && (
                      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                        <Clock size={16} className="text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <p className="font-bold">Your order is currently in process!</p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            Our bakers have received your request. Check back here to see when your order is accepted and put in the oven.
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status === "accepted" && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl p-3.5 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Order Accepted!</p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            The bakery has accepted your order. Your delicious bakes will start preparation shortly.
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status === "preparing" && (
                      <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/50 rounded-2xl p-3.5 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
                        <ChefHat size={16} className="text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Baking & Order Preparation!</p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            Your order is in the oven! Our team is preparing your bakes fresh for you.
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status === "ready_for_pickup" && (
                      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-3.5 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5 animate-pulse">
                        <Package size={16} className="text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Ready for Pickup! 📦</p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            Your fresh bakes are ready! Please come by the shop to collect your order.
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status === "completed" && (
                      <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/50 rounded-2xl p-3.5 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Order Completed ✅</p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            This order was successfully collected. We hope you enjoy your delicious items!
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status === "declined" && (
                      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/50 rounded-2xl p-3.5 text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5">
                        <XCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Order Declined ❌</p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            Unfortunately, we were unable to fulfill your order. Any payment has been refunded or voided.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Items List */}
                    <div className="space-y-2.5 pt-1">
                      <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                        Ordered Items
                      </h4>
                      <div className="divide-y divide-stone-100 dark:divide-stone-850">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold flex items-center justify-center text-[11px]">
                                {item.quantity}x
                              </span>
                              <span className="font-semibold text-stone-800 dark:text-stone-200">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-mono text-stone-600 dark:text-stone-400 font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fulfillment & Payment Details */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                      <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                        {order.fulfillmentType === "pickup" ? (
                          <><Package size={12} className="text-[#D46211]" /> <span className="font-semibold">Pickup</span></>
                        ) : (
                          <><Truck size={12} className="text-[#D46211]" /> <span className="font-semibold">Delivery</span></>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 justify-end">
                        <CreditCard size={12} className="text-[#D46211]" />
                        <span className="font-semibold uppercase">{order.paymentMethod || "card"}</span>
                      </div>
                      {order.fulfillmentType === "pickup" && order.pickupTime && (
                        <div className="col-span-2 flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                          <Clock size={12} /> <span>{order.pickupTime}</span>
                        </div>
                      )}
                      {order.fulfillmentType === "delivery" && order.deliveryAddress && (
                        <div className="col-span-2 flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                          <MapPin size={12} /> <span className="truncate">{order.deliveryAddress}</span>
                        </div>
                      )}
                      {(order.deliveryFee ?? 0) > 0 && (
                        <div className="col-span-2 flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                          <span>Delivery Fee:</span>
                          <span className="font-semibold">${(order.deliveryFee ?? 0).toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer / Total */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                      <span className="font-medium text-stone-500 dark:text-stone-400">Total Price (incl. tax & fees)</span>
                      <span className="font-serif font-bold text-[#D46211] text-base">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
}

export default Account;
