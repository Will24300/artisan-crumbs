import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Check,
  ChefHat,
  Package,
  CheckCircle2,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { API_BASE } from "../utils/api";
import { OrderTrackerModal, type OrderData } from "./OrderTrackerModal";
import type { RootState } from "../store";

const STATUS_CONFIG: Record<
  string,
  { label: string; subtext: string; icon: React.FC<{ className?: string }>; colorClass: string }
> = {
  pending: {
    label: "Order Received",
    subtext: "Bakery reviewing your order",
    icon: Clock,
    colorClass: "bg-amber-500 text-white shadow-amber-500/20",
  },
  accepted: {
    label: "Order Confirmed",
    subtext: "Preparing artisan ingredients",
    icon: Check,
    colorClass: "bg-blue-500 text-white shadow-blue-500/20",
  },
  preparing: {
    label: "In the Oven",
    subtext: "Baking & decorating fresh",
    icon: ChefHat,
    colorClass: "bg-[#D46211] text-white shadow-[#D46211]/25 ring-4 ring-[#D46211]/20",
  },
  ready_for_pickup: {
    label: "Ready for You!",
    subtext: "Ready for pickup or delivery",
    icon: Package,
    colorClass: "bg-emerald-500 text-white shadow-emerald-500/20 ring-4 ring-emerald-500/20",
  },
  completed: {
    label: "Completed",
    subtext: "Delivered & enjoyed",
    icon: CheckCircle2,
    colorClass: "bg-emerald-600 text-white",
  },
};

// Fallback demo order if user wants to test live tracker before placing an order
const DEMO_ORDER: OrderData = {
  _id: "demo-order-883921",
  status: "preparing",
  totalAmount: 42.5,
  fulfillmentType: "pickup",
  pickupTime: "10:30 AM",
  createdAt: new Date().toISOString(),
  items: [
    { name: "Artisan Sourdough Loaf", price: 8.5, quantity: 2 },
    { name: "French Butter Croissant", price: 4.5, quantity: 3 },
  ],
};

export const LiveOrderFloatingWidget: React.FC = () => {
  const authUser = useSelector((state: RootState) => (state as any).auth?.user);
  const token = useSelector((state: RootState) => (state as any).auth?.token);

  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dismissedOrderId, setDismissedOrderId] = useState<string | null>(null);
  const [isDemoActive, setIsDemoActive] = useState(false);

  const prevStatusRef = useRef<string | null>(null);

  const fetchActiveOrders = useCallback(async () => {
    if (!token || !authUser) {
      // Check localStorage for offline/guest demo order
      const saved = localStorage.getItem("artisan_latest_order");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && ["pending", "accepted", "preparing", "ready_for_pickup"].includes(parsed.status)) {
            setActiveOrder(parsed);
            return;
          }
        } catch {
          // Ignore parse error
        }
      }
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const orders: OrderData[] = await res.json();

        // Find the most recent active order
        const foundActive = orders.find((o) =>
          ["pending", "accepted", "preparing", "ready_for_pickup"].includes(o.status)
        );

        if (foundActive) {
          if (prevStatusRef.current && prevStatusRef.current !== foundActive.status) {
            const config = STATUS_CONFIG[foundActive.status];
            if (config) {
              toast.info(`🍞 Order Update: ${config.label}!`, { autoClose: 4000 });
            }
          }
          prevStatusRef.current = foundActive.status;
          setActiveOrder(foundActive);
          setIsDemoActive(false);
        } else {
          setActiveOrder(null);
          prevStatusRef.current = null;
        }
      }
    } catch {
      // Background polling error ignored
    }
  }, [token, authUser]);

  // Polling every 6 seconds
  useEffect(() => {
    fetchActiveOrders();
    const interval = setInterval(fetchActiveOrders, 6000);
    return () => clearInterval(interval);
  }, [fetchActiveOrders]);

  // Listen for order placed custom event
  useEffect(() => {
    const handleOrderPlaced = () => {
      fetchActiveOrders();
    };
    window.addEventListener("artisan_order_placed", handleOrderPlaced);
    return () => window.removeEventListener("artisan_order_placed", handleOrderPlaced);
  }, [fetchActiveOrders]);

  const currentOrder = activeOrder || (isDemoActive ? DEMO_ORDER : null);

  // If no real order & demo not explicitly triggered, show a subtle "Live Bakery Status" button to test
  if (!currentOrder || dismissedOrderId === currentOrder._id) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsDemoActive(true);
            setDismissedOrderId(null);
          }}
          className="flex items-center gap-2 bg-[#241812] dark:bg-stone-800 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-xl border border-stone-700/60 hover:bg-[#D46211] transition-all cursor-pointer"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <ChefHat className="w-3.5 h-3.5 text-amber-400" />
          <span>Live Bakery Tracker</span>
          <Eye className="w-3 h-3 text-stone-400 ml-1" />
        </motion.button>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[currentOrder.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm w-auto"
        >
          {isMinimized ? (
            /* Minimized Pulsing Pill */
            <div
              onClick={() => setIsMinimized(false)}
              className="group flex items-center gap-3 bg-white dark:bg-stone-900 border-2 border-[#D46211] rounded-full px-4 py-2.5 shadow-2xl cursor-pointer hover:scale-105 transition-all"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-stone-100">
                <StatusIcon className="w-3.5 h-3.5 text-[#D46211]" />
                <span>Order #{currentOrder._id.slice(-6).toUpperCase()}</span>
                <span className="text-[#D46211] font-semibold">({statusConfig.label})</span>
              </div>
              <ChevronUp className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
            </div>
          ) : (
            /* Expanded Interactive Card */
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-xl group min-w-[280px]">
              {/* Top ambient glow */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#D46211]/15 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header controls */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D46211] bg-[#FFF4EB] dark:bg-[#D46211]/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Live Bakery Tracker
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition-colors"
                    title="Minimize widget"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDismissedOrderId(currentOrder._id);
                      setIsDemoActive(false);
                    }}
                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition-colors"
                    title="Dismiss widget"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div
                onClick={() => setIsTrackerOpen(true)}
                className="cursor-pointer space-y-3 p-1 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${statusConfig.colorClass}`}
                  >
                    <StatusIcon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {statusConfig.label}
                      </h4>
                      <span className="text-[11px] font-mono text-stone-400">
                        #{currentOrder._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {statusConfig.subtext}
                    </p>
                  </div>
                </div>

                {/* Action Link */}
                <div className="flex items-center justify-between text-xs font-bold text-[#D46211] pt-1">
                  <span className="flex items-center gap-1 hover:underline">
                    View Live Stepper Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-semibold text-stone-400">
                    {currentOrder.items?.length || 1} item{currentOrder.items?.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Embedded Order Tracker Modal */}
      {isTrackerOpen && (
        <OrderTrackerModal
          isOpen={isTrackerOpen}
          order={currentOrder}
          onClose={() => setIsTrackerOpen(false)}
        />
      )}
    </>
  );
};
