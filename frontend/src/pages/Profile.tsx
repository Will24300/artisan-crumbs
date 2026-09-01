import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { setCredentials } from "../features/auth";
import { API_BASE } from "../utils/api";
import { toast } from "react-toastify";
import { User, Mail, Shield, KeyRound, Calendar, ShoppingBag, Clock, CheckCircle2, AlertCircle, Edit3, Save, Sparkles, MapPin, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { OrderTrackerModal, type OrderData } from "../components/OrderTrackerModal";

export const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Tracker Modal State
  const [selectedTrackerOrder, setSelectedTrackerOrder] = useState<OrderData | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingOrders(true);
      const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      toast.error("Failed to load order history");
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !token) return;

    try {
      setUpdatingProfile(true);
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
        return;
      }
      dispatch(setCredentials({ token, user: data.user }));
      toast.success("Profile updated successfully!");
      setIsEditingName(false);
    } catch {
      toast.error("Unable to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !token) return;

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
        return;
      }
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Unable to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active") {
      return ["pending", "accepted", "preparing", "ready_for_pickup"].includes(order.status);
    }
    if (activeTab === "completed") {
      return ["completed", "declined"].includes(order.status);
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Pending Review</span>;
      case "accepted":
        return <span className="bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Accepted</span>;
      case "preparing":
        return <span className="bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> In the Oven</span>;
      case "ready_for_pickup":
        return <span className="bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5" /> Ready for Pickup</span>;
      case "completed":
        return <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case "declined":
        return <span className="bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Declined</span>;
      default:
        return <span className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold px-3 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0f0d0c] pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <OrderTrackerModal
        isOpen={Boolean(selectedTrackerOrder)}
        order={selectedTrackerOrder}
        onClose={() => setSelectedTrackerOrder(null)}
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FFF4EB] dark:bg-[#D46211]/20 flex items-center justify-center text-[#D46211] font-serif font-bold text-2xl sm:text-3xl shrink-0 shadow-inner">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#241812] dark:text-stone-100">
                  {user?.name}
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FFF4EB] text-[#D46211] px-2.5 py-0.5 rounded-full">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold z-10">
            <div className="bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 px-3.5 py-2 rounded-xl text-stone-600 dark:text-stone-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D46211]" />
              <span>Provider: {user?.provider || "Standard Email"}</span>
            </div>
            <div className="bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 px-3.5 py-2 rounded-xl text-stone-600 dark:text-stone-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D46211]" />
              <span>Total Orders: {orders.length}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Account Settings */}
          <div className="space-y-6">
            {/* Edit Name Card */}
            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#241812] dark:text-stone-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D46211]" /> Profile Info
                </h3>
                {!isEditingName && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs font-bold text-[#D46211] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              {isEditingName ? (
                <form onSubmit={handleUpdateName} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 outline-none focus:border-[#D46211]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingName(false);
                        setName(user?.name || "");
                      }}
                      className="flex-1 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="flex-1 py-2 rounded-xl bg-[#D46211] hover:bg-[#b04f0b] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium">Name:</span>{" "}
                    <span className="font-bold text-stone-800 dark:text-stone-200">{user?.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">Email:</span>{" "}
                    <span className="font-bold text-stone-800 dark:text-stone-200">{user?.email}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Password Change Card (only for email accounts) */}
            {(!user?.provider || user?.provider === "local") && (
              <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#241812] dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <KeyRound className="w-4 h-4 text-[#D46211]" /> Security
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 outline-none focus:border-[#D46211]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 outline-none focus:border-[#D46211]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    {changingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#241812] dark:text-stone-100 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D46211]" /> Order History
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    View and track all your artisanal bakery orders
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-850 rounded-2xl text-xs font-bold">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      activeTab === "all"
                        ? "bg-white dark:bg-stone-900 text-[#D46211] shadow-sm"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("active")}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      activeTab === "active"
                        ? "bg-white dark:bg-stone-900 text-[#D46211] shadow-sm"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    Active ({orders.filter((o) => ["pending", "accepted", "preparing", "ready_for_pickup"].includes(o.status)).length})
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      activeTab === "completed"
                        ? "bg-white dark:bg-stone-900 text-[#D46211] shadow-sm"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    Completed ({orders.filter((o) => ["completed", "declined"].includes(o.status)).length})
                  </button>
                </div>
              </div>

              {/* Order Cards List */}
              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-stone-400 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#D46211] border-t-transparent rounded-full animate-spin" />
                  <span>Loading orders...</span>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-850 flex items-center justify-center text-stone-400 mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-stone-700 dark:text-stone-300 text-sm">No orders found</h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    You haven&apos;t placed any bakery orders in this category yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-[#D46211]/50 transition-all space-y-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <p className="text-[11px] text-stone-400">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                          <button
                            onClick={() => setSelectedTrackerOrder(order)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#D46211] hover:bg-[#b04f0b] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Track Live</span>
                          </button>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-600 dark:text-stone-300 text-[10px]">
                                {item.quantity}x
                              </span>
                              <span className="font-semibold text-stone-800 dark:text-stone-200">{item.name}</span>
                            </div>
                            <span className="font-mono text-stone-600 dark:text-stone-400">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                        <div className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D46211]" />
                          <span>{order.fulfillmentType === "pickup" ? "Pickup" : "Delivery"}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-stone-400">Total: </span>
                          <span className="font-serif font-bold text-base text-[#D46211]">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
