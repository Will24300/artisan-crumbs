import React, { useEffect, useState, useCallback } from "react";
import { X, Check, Clock, Package, ChefHat, CheckCircle2, AlertCircle, ShoppingBag, MapPin, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "../utils/api";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customCake?: any;
}

export interface OrderData {
  _id: string;
  status: "pending" | "accepted" | "preparing" | "ready_for_pickup" | "completed" | "declined";
  totalAmount: number;
  fulfillmentType: "pickup" | "delivery";
  pickupTime?: string;
  deliveryAddress?: string;
  deliveryFee?: number;
  items: OrderItem[];
  createdAt: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

interface OrderTrackerModalProps {
  order: OrderData | null;
  isOpen: boolean;
  onClose: () => void;
}

const STAGES = [
  { key: "pending", label: "Order Received", desc: "Awaiting bakery review", icon: Clock },
  { key: "accepted", label: "Order Accepted", desc: "Confirmed by artisan team", icon: Check },
  { key: "preparing", label: "In the Oven", desc: "Baking & decorating fresh", icon: ChefHat },
  { key: "ready_for_pickup", label: "Ready for You", desc: "Ready for pickup or delivery", icon: Package },
  { key: "completed", label: "Completed", desc: "Delivered & enjoyed", icon: CheckCircle2 },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order: initialOrder, isOpen, onClose }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(initialOrder);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setCurrentOrder(initialOrder);
  }, [initialOrder]);

  const fetchLatestOrder = useCallback(async () => {
    if (!initialOrder?._id || !token) return;
    try {
      setRefreshing(true);
      const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const orders: OrderData[] = await res.json();
        const found = orders.find((o) => o._id === initialOrder._id);
        if (found) {
          setCurrentOrder(found);
        }
      }
    } catch {
      // Ignore background refresh errors
    } finally {
      setRefreshing(false);
    }
  }, [initialOrder?._id, token]);

  // Polling every 5 seconds while open for active orders
  useEffect(() => {
    if (!isOpen || !initialOrder?._id) return;
    fetchLatestOrder();
    const interval = setInterval(fetchLatestOrder, 5000);
    return () => clearInterval(interval);
  }, [isOpen, initialOrder?._id, fetchLatestOrder]);

  if (!isOpen || !currentOrder) return null;

  const isDeclined = currentOrder.status === "declined";

  // Determine current active stage index
  const getStageIndex = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "accepted":
        return 1;
      case "preparing":
        return 2;
      case "ready_for_pickup":
        return 3;
      case "completed":
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(currentOrder.status);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-6 my-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D46211] bg-[#FFF4EB] dark:bg-[#D46211]/15 px-3 py-1 rounded-full">
                  Live Order Tracker
                </span>
                {refreshing && (
                  <RefreshCw className="w-3.5 h-3.5 text-stone-400 animate-spin" />
                )}
              </div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#241812] dark:text-stone-100 mt-1">
                Order #{currentOrder._id.slice(-8).toUpperCase()}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Placed on {new Date(currentOrder.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Declined banner */}
          {isDeclined ? (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300 flex items-start gap-3 text-xs">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Order Declined</p>
                <p className="mt-0.5">
                  Unfortunately, this order could not be fulfilled by our bakery team. If you paid online, your payment has been automatically refunded.
                </p>
              </div>
            </div>
          ) : (
            /* Live Progress Stepper */
            <div className="py-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Current Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Updates Active
                </span>
              </div>

              {/* Stepper Timeline */}
              <div className="relative space-y-6 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
                {STAGES.map((stage, idx) => {
                  const isPassed = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const StageIcon = stage.icon;

                  return (
                    <div key={stage.key} className="relative flex items-start gap-4 z-10">
                      <div
                        className={`w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${isPassed
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                            : isCurrent
                              ? "bg-[#D46211] border-[#D46211] text-white shadow-lg shadow-[#D46211]/25 ring-4 ring-[#D46211]/20 scale-110"
                              : "bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-400"
                          }`}
                      >
                        {isPassed ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <StageIcon className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex-1 pt-0.5">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-bold transition-colors ${isCurrent
                                ? "text-[#D46211] dark:text-[#F2A469]"
                                : isPassed
                                  ? "text-stone-900 dark:text-stone-100"
                                  : "text-stone-400 dark:text-stone-600"
                              }`}
                          >
                            {stage.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-[#D46211] bg-[#FFF4EB] dark:bg-[#D46211]/15 px-2 py-0.5 rounded uppercase tracking-wider">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fulfillment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-850/60 border border-stone-100 dark:border-stone-800 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D46211] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-700 dark:text-stone-300">
                  {currentOrder.fulfillmentType === "pickup" ? "Store Pickup" : "Delivery Address"}
                </p>
                <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                  {currentOrder.fulfillmentType === "pickup"
                    ? currentOrder.pickupTime || "Artisan Crumbs Bakery Main Shop"
                    : currentOrder.deliveryAddress || "Standard Delivery"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#D46211] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-700 dark:text-stone-300">Payment Summary</p>
                <p className="text-stone-500 dark:text-stone-400 mt-0.5 capitalize">
                  {currentOrder.paymentMethod || "Card"} •{" "}
                  <span className="font-bold text-[#D46211]">${currentOrder.totalAmount.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Ordered Items ({currentOrder.items.length})
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {currentOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-850 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {item.customCake ? (
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-stone-800 dark:to-stone-700 flex items-center justify-center text-[#D46211] shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    ) : item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 rounded-lg object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-200">{item.name}</p>
                      <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
