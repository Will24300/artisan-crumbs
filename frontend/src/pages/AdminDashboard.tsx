import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Edit2, Trash2, X, Check, Ban } from "lucide-react";

interface RootState {
  auth: {
    token: string | null;
    user: {
      role: string;
    } | null;
  };
}

interface ProductSummary {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  tags: string[];
}

interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummary {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

function AdminDashboard() {
  const token = useSelector((state: RootState) => state.auth.token);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [message, setMessage] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");

  const fetchAdminData = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setMessage("Unable to load admin dashboard");
        return;
      }
      const data = await response.json();
      setUsers(data.users || []);
      setProducts(data.products || []);
      setOrders(data.orders || []);
    } catch {
      setMessage("Unable to connect to backend.");
    }
  };

  useEffect(() => {
    if (!token || userRole !== "admin") {
      return;
    }
    fetchAdminData();
  }, [token, userRole]);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedProductId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImage("");
    setTags("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductSummary) => {
    setModalMode("edit");
    setSelectedProductId(product._id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setCategory(product.category || "");
    setImage(product.image || "");
    setTags(product.tags ? product.tags.join(", ") : "");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!name || !description || !price || !category || !image) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    const payload = {
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      tags: tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    try {
      const url = modalMode === "add" ? "/api/products" : `/api/products/${selectedProductId}`;
      const method = modalMode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || `Failed to ${modalMode} product`);
        return;
      }

      if (modalMode === "add") {
        setProducts((prev) => [data, ...prev]);
      } else {
        setProducts((prev) => prev.map((p) => (p._id === selectedProductId ? data : p)));
      }

      setIsModalOpen(false);
      setErrorMsg("");
    } catch {
      setErrorMsg("Connection error. Could not save product.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.error || "Failed to delete product");
        return;
      }

      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setMessage("");
    } catch {
      setMessage("Connection error. Could not delete product.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.error || "Failed to delete user");
        return;
      }

      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setMessage("");
    } catch {
      setMessage("Connection error. Could not delete user.");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: "accepted" | "declined") => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || `Failed to update order to ${status}`);
        return;
      }

      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
      setMessage("");
    } catch {
      setMessage("Connection error. Could not update order status.");
    }
  };

  if (userRole !== "admin") {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-white rounded-[32px] p-10 text-center shadow-xl shadow-black/5">
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="mt-3 text-sm text-[#64748B]">You need an administrator account to view this page.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F8F7F5] px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-[#64748B]">Manage customers, products, and orders from one place.</p>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-600">
            {message}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Customers Section */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900 font-serif">Customers</h2>
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-sm text-[#64748B]">No users available.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="rounded-3xl border border-gray-100 p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-[#64748B]">{user.email}</p>
                      <span className="mt-2 inline-block rounded-full bg-[#F59E0B]/10 px-3 py-0.5 text-xs font-semibold text-[#B45309]">
                        {user.role}
                      </span>
                    </div>
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 rounded-full hover:bg-red-50 text-red-600 transition duration-200 cursor-pointer"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 font-serif">Products</h2>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 rounded-full bg-[#F59E0B] px-4 py-2.5 text-xs font-bold text-black transition hover:bg-[#dca022] duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <div className="space-y-4">
              {products.length === 0 ? (
                <p className="text-sm text-[#64748B]">No products available.</p>
              ) : (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="rounded-3xl border border-gray-100 p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-2xl border border-gray-100 bg-gray-50 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=60";
                          }}
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-[#64748B]">
                          {product.category} · ${product.price.toFixed(2)}
                        </p>
                        {product.description && (
                          <p className="text-xs text-[#64748B] mt-1 line-clamp-1 max-w-[200px] sm:max-w-md">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition duration-200 cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 rounded-full hover:bg-red-50 text-red-600 transition duration-200 cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-900 font-serif">Customer Orders</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-[#64748B]">No orders placed yet.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-3xl border border-gray-100 p-6 hover:shadow-xs transition duration-200"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Order ID: <span className="font-mono text-xs">{order._id}</span>
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Placed by:{" "}
                        <span className="font-semibold text-gray-700">
                          {order.user?.name || "Deleted User"}
                        </span>{" "}
                        ({order.user?.email || "N/A"})
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#64748B]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                          order.status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : order.status === "accepted"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 max-w-xl">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">
                          {item.name}{" "}
                          <span className="text-[#64748B] text-xs font-semibold">x{item.quantity}</span>
                        </span>
                        <span className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-sm font-bold border-t border-gray-100 pt-3 mt-3">
                      <span className="text-gray-900">Total (incl. tax)</span>
                      <span className="text-[#F59E0B]">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.status === "pending" && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, "declined")}
                        className="flex items-center gap-1.5 rounded-full border border-red-200 hover:bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition cursor-pointer duration-200"
                      >
                        <Ban className="w-3.5 h-3.5" /> Decline Order
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, "accepted")}
                        className="flex items-center gap-1.5 rounded-full bg-green-600 hover:bg-green-700 px-5 py-2.5 text-xs font-bold text-white transition cursor-pointer duration-200"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept Order
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition duration-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {modalMode === "add" ? "Add New Product" : "Edit Product"}
            </h3>

            {errorMsg && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
                  placeholder="e.g. Chocolate Fudge Cake"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
                    placeholder="e.g. 24.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
                    placeholder="e.g. Cake, Bread, Muffins"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
                  placeholder="e.g. https://images.unsplash.com/... or image path"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B] resize-none"
                  placeholder="Describe the product..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F59E0B]"
                  placeholder="e.g. limited, chocolate, vegan"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border border-gray-200 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#F59E0B] py-3 text-sm font-bold text-black transition hover:bg-[#dca022] cursor-pointer"
                >
                  {modalMode === "add" ? "Create Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
