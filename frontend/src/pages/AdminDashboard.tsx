import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Ban,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart2,
  Settings,
  Bell,
  Search,
  Upload,
  AlertTriangle,
  Menu,
  Eye,
  DollarSign,
  ShoppingCart,
  Star,
  Store,
  TrendingUp,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface RootState {
  auth: {
    token: string | null;
    user: { role: string; name?: string } | null;
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
  stock: number;
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
  user: { _id: string; name: string; email: string } | null;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

type Section = "overview" | "products" | "orders" | "customers" | "analytics" | "settings";

// ─── SVG Chart: Bar Chart ─────────────────────────────────────────────────
function BarChart({
  data,
  labels,
  color = "#F59E0B",
}: {
  data: number[];
  labels?: string[];
  color?: string;
}) {
  const max = Math.max(...data, 1);
  const defaultLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const lbs = labels || defaultLabels.slice(0, data.length);
  const barW = Math.floor(240 / data.length) - 6;
  return (
    <svg viewBox={`0 0 ${data.length * (barW + 6) + 20} 120`} className="w-full h-full">
      {[0, 25, 50, 75, 100].map((pct) => (
        <line
          key={pct}
          x1={10}
          x2={data.length * (barW + 6) + 10}
          y1={90 - (pct / 100) * 75}
          y2={90 - (pct / 100) * 75}
          stroke="#F3F4F6"
          strokeWidth={1}
        />
      ))}
      {data.map((val, i) => {
        const height = Math.max((val / max) * 75, 2);
        const x = i * (barW + 6) + 10;
        const y = 90 - height;
        const opacity = 0.25 + (val / max) * 0.75;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={height} rx={5} fill={color} opacity={opacity} />
            <text
              x={x + barW / 2}
              y={108}
              textAnchor="middle"
              fontSize={9}
              fill="#9CA3AF"
              fontFamily="sans-serif"
            >
              {lbs[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Chart: Line Chart ────────────────────────────────────────────────
function LineChart({
  data,
  labels,
  color = "#F59E0B",
}: {
  data: number[];
  labels?: string[];
  color?: string;
}) {
  const max = Math.max(...data, 1);
  const w = 260;
  const h = 80;
  const pts = data.map((val, i) => {
    const x = i * (w / (data.length - 1)) + 10;
    const y = h - (val / max) * (h - 10) + 5;
    return `${x},${y}`;
  });
  const fillPts = [`10,${h + 5}`, ...pts, `${w + 10},${h + 5}`].join(" ");
  const lbs = labels || Array.from({ length: data.length }, (_, i) => `W${i + 1}`);
  return (
    <svg viewBox={`0 0 280 110`} className="w-full h-full">
      {[0, 33, 66, 100].map((pct) => (
        <line
          key={pct}
          x1={10}
          x2={270}
          y1={h - (pct / 100) * (h - 10) + 5}
          y2={h - (pct / 100) * (h - 10) + 5}
          stroke="#F3F4F6"
          strokeWidth={1}
        />
      ))}
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#lineGrad)" />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((val, i) => {
        const x = i * (w / (data.length - 1)) + 10;
        const y = h - (val / max) * (h - 10) + 5;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill="white" stroke={color} strokeWidth={2} />
            {i % Math.ceil(data.length / 6) === 0 && (
              <text
                x={x}
                y={106}
                textAnchor="middle"
                fontSize={8}
                fill="#9CA3AF"
                fontFamily="sans-serif"
              >
                {lbs[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Chart: Donut Chart ───────────────────────────────────────────────
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = 55;
  const cy = 55;
  const r = 40;
  const ir = 24;
  let cum = -90;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const slices = data.map((d) => {
    const angle = (d.value / total) * 360;
    const sa = cum;
    cum += angle;
    const ea = cum;
    const x1 = cx + r * Math.cos(toRad(sa));
    const y1 = cy + r * Math.sin(toRad(sa));
    const x2 = cx + r * Math.cos(toRad(ea));
    const y2 = cy + r * Math.sin(toRad(ea));
    const ix1 = cx + ir * Math.cos(toRad(sa));
    const iy1 = cy + ir * Math.sin(toRad(sa));
    const ix2 = cx + ir * Math.cos(toRad(ea));
    const iy2 = cy + ir * Math.sin(toRad(ea));
    const la = angle > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${la} 0 ${ix1} ${iy1} Z`;
    return { ...d, path, pct: Math.round((d.value / total) * 100) };
  });

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 110 110" className="w-28 h-28 flex-shrink-0">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} className="hover:opacity-80 transition-opacity" />
        ))}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fontSize={9}
          fill="#9CA3AF"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          Total
        </text>
        <text
          x={cx}
          y={cy + 9}
          textAnchor="middle"
          fontSize={14}
          fill="#111827"
          fontFamily="sans-serif"
          fontWeight="700"
        >
          {total}
        </text>
      </svg>
      <div className="space-y-2 flex-1">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-xs text-gray-500 capitalize flex-1">{s.label}</span>
            <span className="text-xs font-bold text-gray-800">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>{icon}</div>
        {sub && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            {sub}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${on ? "bg-amber-500" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-5" : ""}`}
      />
    </button>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────
function AdminDashboard() {
  const token = useSelector((state: RootState) => state.auth.token);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const userRole = authUser?.role;

  // ── Server Data ────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ── UI State ───────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [salesPeriod, setSalesPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [productFilter, setProductFilter] = useState("all");
  const [customerSearch, setCustomerSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  // ── Product Modal ──────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCat, setPCat] = useState("");
  const [pImage, setPImage] = useState("");
  const [pTags, setPTags] = useState("");
  const [pStock, setPStock] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ── Settings State ─────────────────────────────────────────────────────
  const [storeName, setStoreName] = useState("Artisan Crumbs");
  const [storeEmail, setStoreEmail] = useState("hello@artisancrumbs.com");
  const [storePhone, setStorePhone] = useState("+1 (555) 123-4567");
  const [storeAddress, setStoreAddress] = useState("123 Baker Street, NY");
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [cashEnabled, setCashEnabled] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState("4.99");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ── Fetch Admin Data ───────────────────────────────────────────────────
  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setMessage("Unable to load admin dashboard");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
      setProducts(data.products || []);
      setOrders(data.orders || []);
    } catch {
      setMessage("Unable to connect to the backend. Is the server running?");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!token || userRole !== "admin") return;
    fetchAdminData();
  }, [token, userRole]);

  // ── Derived Stats ──────────────────────────────────────────────────────
  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== "declined"),
    [orders]
  );
  const totalRevenue = useMemo(
    () => activeOrders.reduce((s, o) => s + o.totalAmount, 0),
    [activeOrders]
  );
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === "pending"), [orders]);
  const acceptedOrders = useMemo(() => orders.filter((o) => o.status === "accepted"), [orders]);

  const revenueByDay = useMemo(() => {
    const days = [0, 0, 0, 0, 0, 0, 0];
    orders.forEach((o) => {
      if (o.status === "declined") return;
      const d = new Date(o.createdAt).getDay();
      const idx = d === 0 ? 6 : d - 1;
      days[idx] += o.totalAmount;
    });
    const hasData = days.some((v) => v > 0);
    return hasData ? days : [110, 195, 162, 290, 245, 388, 330];
  }, [orders]);

  const categoryData = useMemo(() => {
    const palette = ["#F59E0B", "#FB923C", "#A78BFA", "#34D399", "#60A5FA", "#F472B6"];
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value], i) => ({
      label,
      value,
      color: palette[i % palette.length],
    }));
  }, [products]);

  const topProducts = useMemo(() => {
    const sales: Record<string, { name: string; total: number; qty: number }> = {};
    orders.forEach((o) => {
      if (o.status === "declined") return;
      o.items.forEach((item) => {
        if (!sales[item.productId])
          sales[item.productId] = { name: item.name, total: 0, qty: 0 };
        sales[item.productId].total += item.price * item.quantity;
        sales[item.productId].qty += item.quantity;
      });
    });
    return Object.values(sales)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [orders]);

  const customerOrderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      if (o.user?._id) counts[o.user._id] = (counts[o.user._id] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const filteredProducts = useMemo(() => {
    if (productFilter === "all") return products;
    return products.filter((p) => p.category.toLowerCase().includes(productFilter));
  }, [products, productFilter]);

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, customerSearch]);

  // Sample analytics data (for charts that don't have a backend endpoint yet)
  const weeklyRevenueSample = useMemo(
    () =>
      activeOrders.length > 0
        ? [120, 340, 280, 450, 390, 510, 480, 620, 540, 700, 660, 780]
        : [80, 120, 200, 160, 280, 240, 310, 290, 380, 420, 390, 460],
    [activeOrders.length]
  );

  // Inventory derived stats (uses real p.stock from DB)
  const outOfStock = useMemo(() => products.filter((p) => p.stock === 0), [products]);
  const lowStock = useMemo(() => products.filter((p) => p.stock > 0 && p.stock <= 5), [products]);
  const inStock = useMemo(() => products.filter((p) => p.stock > 5), [products]);

  // Revenue per category (derived from real orders)
  const categoryRevenueData = useMemo(() => {
    const palette = ["#F59E0B", "#FB923C", "#A78BFA", "#34D399", "#60A5FA", "#F472B6"];
    // Build a productId -> category map
    const productCategoryMap: Record<string, string> = {};
    products.forEach((p) => { productCategoryMap[p._id] = p.category; });

    const revenue: Record<string, number> = {};
    orders.forEach((o) => {
      if (o.status === "declined") return;
      o.items.forEach((item) => {
        const cat = productCategoryMap[item.productId] || "Other";
        revenue[cat] = (revenue[cat] || 0) + item.price * item.quantity;
      });
    });

    // Fall back to product count if no orders yet
    if (Object.keys(revenue).length === 0) {
      const counts: Record<string, number> = {};
      products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
      return Object.entries(counts).map(([label, value], i) => ({
        label, value, color: palette[i % palette.length], isCount: true,
      }));
    }

    return Object.entries(revenue)
      .sort(([, a], [, b]) => b - a)
      .map(([label, value], i) => ({
        label, value, color: palette[i % palette.length], isCount: false,
      }));
  }, [products, orders]);

  // ── Product CRUD ───────────────────────────────────────────────────────
  const openAddModal = () => {
    setModalMode("add");
    setSelectedProductId(null);
    setPName(""); setPDesc(""); setPPrice(""); setPCat(""); setPImage(""); setPTags(""); setPStock("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductSummary) => {
    setModalMode("edit");
    setSelectedProductId(p._id);
    setPName(p.name);
    setPDesc(p.description || "");
    setPPrice(p.price.toString());
    setPCat(p.category || "");
    setPImage(p.image || "");
    setPTags(p.tags?.join(", ") || "");
    setPStock(p.stock?.toString() || "0");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!pName || !pDesc || !pPrice || !pCat || !pImage) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }
    const payload = {
      name: pName,
      description: pDesc,
      price: parseFloat(pPrice),
      category: pCat,
      image: pImage,
      tags: pTags ? pTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      stock: parseInt(pStock) || 0,
    };
    try {
      const url = modalMode === "add" ? "/api/products" : `/api/products/${selectedProductId}`;
      const method = modalMode === "add" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || `Failed to ${modalMode} product`); return; }
      if (modalMode === "add") {
        setProducts((prev) => [data, ...prev]);
      } else {
        setProducts((prev) => prev.map((p) => (p._id === selectedProductId ? data : p)));
      }
      setIsModalOpen(false);
    } catch {
      setErrorMsg("Connection error. Could not save product.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!token || !window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const e = await res.json(); setMessage(e.error || "Failed to delete"); return; }
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch { setMessage("Connection error."); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!token || !window.confirm("Delete this customer? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const e = await res.json(); setMessage(e.error || "Failed to delete"); return; }
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch { setMessage("Connection error."); }
  };

  const handleUpdateOrderStatus = async (id: string, status: "accepted" | "declined") => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Failed to update order"); return; }
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
    } catch { setMessage("Connection error."); }
  };

  const handleUpdateUserRole = async (id: string, role: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Failed to update role"); return; }
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: data.role } : u)));
    } catch { setMessage("Connection error."); }
  };

  // ── Access Guard ───────────────────────────────────────────────────────
  if (userRole !== "admin") {
    return (
      <section className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
        <div className="max-w-sm w-full bg-white rounded-3xl p-10 text-center shadow-xl">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access Required</h1>
          <p className="mt-3 text-sm text-gray-500">
            You need an administrator account to view this page.
          </p>
        </div>
      </section>
    );
  }

  // ── Nav config ─────────────────────────────────────────────────────────
  const navItems: { id: Section; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { id: "products", label: "Products", icon: <Package className="w-[18px] h-[18px]" />, badge: products.length },
    { id: "orders", label: "Orders", icon: <ShoppingBag className="w-[18px] h-[18px]" />, badge: pendingOrders.length || undefined },
    { id: "customers", label: "Customers", icon: <Users className="w-[18px] h-[18px]" />, badge: users.length },
    { id: "analytics", label: "Analytics", icon: <BarChart2 className="w-[18px] h-[18px]" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-[18px] h-[18px]" /> },
  ];

  const avatarColors = ["bg-amber-500", "bg-orange-500", "bg-purple-500", "bg-blue-500", "bg-emerald-500", "bg-rose-500"];
  const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];
  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const fallbackImg = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=60";

  // ── SECTION: OVERVIEW ─────────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-amber-600" />}
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          sub="+12.4%"
          bg="bg-amber-50"
        />
        <StatCard
          icon={<ShoppingCart className="w-5 h-5 text-orange-500" />}
          label="Total Orders"
          value={String(orders.length)}
          sub={pendingOrders.length > 0 ? `${pendingOrders.length} pending` : undefined}
          bg="bg-orange-50"
        />
        <StatCard
          icon={<Package className="w-5 h-5 text-purple-500" />}
          label="Products Listed"
          value={String(products.length)}
          bg="bg-purple-50"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-blue-500" />}
          label="Customers"
          value={String(users.length)}
          sub={`${Object.values(customerOrderCounts).filter((c) => c > 1).length} repeat`}
          bg="bg-blue-50"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5">Orders broken down by day of week</p>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {(["daily", "weekly", "monthly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSalesPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    salesPeriod === p
                      ? "bg-white text-amber-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-36">
            <BarChart
              data={revenueByDay}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            />
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <span className="text-xs text-gray-400">Total this week</span>
            <span className="text-sm font-bold text-amber-600">
              ${revenueByDay.reduce((a, b) => a + b, 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Category Donut Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Product Categories</h3>
          {categoryData.length > 0 ? (
            <DonutChart data={categoryData} />
          ) : (
            <div className="h-32 flex flex-col items-center justify-center gap-2 text-gray-300">
              <Package className="w-8 h-8" />
              <p className="text-xs">No products yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">Top Selling Cakes</h3>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 text-xs font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <span className="text-sm font-bold text-amber-600 pl-2">
                        ${p.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${(p.total / (topProducts[0]?.total || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-300">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs">No sales data yet</p>
            </div>
          )}
        </div>

        {/* Activity / Notifications Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">Recent Activity</h3>
            {pendingOrders.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                {pendingOrders.length} new
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {orders.slice(0, 10).map((o) => (
              <div key={o._id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    o.status === "pending"
                      ? "bg-amber-400"
                      : o.status === "accepted"
                      ? "bg-emerald-400"
                      : "bg-red-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    Order from{" "}
                    <span className="font-semibold text-gray-900">
                      {o.user?.name || "Guest"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(o.createdAt).toLocaleDateString()} · ${o.totalAmount.toFixed(2)}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                    o.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : o.status === "accepted"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {o.status}
                </span>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="py-8 text-center text-gray-300">
                <Bell className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs">No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── SECTION: PRODUCTS ─────────────────────────────────────────────────
  const renderProducts = () => (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "cake", label: "🎂 Cakes" },
            { key: "pastry", label: "🥐 Pastries" },
            { key: "bread", label: "🍞 Bread" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setProductFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                productFilter === f.key
                  ? "bg-amber-500 text-white shadow-sm shadow-amber-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-amber-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <label className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:border-amber-300 cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5" />
            Bulk Upload
            <input
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0])
                  toast.info(
                    `Bulk upload for "${e.target.files[0].name}" received.\nBackend CSV parsing integration can be added in /api/products/bulk.`
                  );
              }}
            />
          </label>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-all shadow-sm shadow-amber-200"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Product Count */}
      <p className="text-sm text-gray-400">
        Showing <strong className="text-gray-700">{filteredProducts.length}</strong> product
        {filteredProducts.length !== 1 ? "s" : ""}
      </p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No products in this category</p>
          <button onClick={openAddModal} className="mt-4 text-sm text-amber-600 font-semibold hover:underline">
            Add your first product →
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative h-44 bg-amber-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImg;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 border border-white/50 capitalize shadow-sm">
                  {product.category}
                </span>
                <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEditModal(product)}
                    className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-sm"
                    title="Edit"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-red-500 hover:bg-white shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900 text-sm leading-tight">{product.name}</h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-amber-600 font-bold text-base">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 mt-0.5">
                      Stock: <span className={product.stock === 0 ? "text-red-500" : "text-gray-700"}>{product.stock}</span>
                    </span>
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex gap-1">
                      {product.tags.slice(0, 1).map((tag) => (
                        <span key={tag} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── SECTION: ORDERS ───────────────────────────────────────────────────
  const renderOrders = () => (
    <div className="space-y-5">
      {/* Status Summary Pills */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "All Orders", count: orders.length, cls: "bg-gray-100 text-gray-700" },
          { label: "Pending", count: pendingOrders.length, cls: "bg-amber-100 text-amber-700" },
          { label: "Accepted", count: acceptedOrders.length, cls: "bg-emerald-100 text-emerald-700" },
          {
            label: "Declined",
            count: orders.filter((o) => o.status === "declined").length,
            cls: "bg-red-100 text-red-700",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.cls} px-4 py-1.5 rounded-full text-sm font-semibold`}>
            {s.label}:{" "}
            <strong>{s.count}</strong>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No orders have been placed yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <>
                    <tr
                      key={order._id}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(expandedOrder === order._id ? null : order._id)
                      }
                    >
                      <td className="px-5 py-4 text-xs font-mono text-gray-400">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg ${getAvatarColor(order.user?.name || "G")} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                          >
                            {getInitials(order.user?.name || "Guest")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.user?.name || "Deleted User"}
                            </p>
                            <p className="text-xs text-gray-400">{order.user?.email || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-amber-600">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : order.status === "accepted"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {order.status === "accepted"
                            ? "✓ Accepted"
                            : order.status === "declined"
                            ? "✗ Declined"
                            : "⏳ Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              setExpandedOrder(expandedOrder === order._id ? null : order._id)
                            }
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {order.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateOrderStatus(order._id, "accepted")}
                                className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition"
                                title="Accept order"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(order._id, "declined")}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                                title="Decline order"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Order Detail */}
                    {expandedOrder === order._id && (
                      <tr key={`${order._id}-exp`}>
                        <td
                          colSpan={7}
                          className="px-5 py-0 bg-amber-50/60 border-b border-amber-100"
                        >
                          <div className="py-5 grid sm:grid-cols-2 gap-6">
                            {/* Order Items */}
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Order Items
                              </p>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between text-sm bg-white rounded-xl px-4 py-2.5 border border-amber-100"
                                  >
                                    <span className="text-gray-800 font-medium">
                                      {item.name}{" "}
                                      <span className="text-gray-400 text-xs">
                                        ×{item.quantity}
                                      </span>
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                                <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-amber-200 px-1">
                                  <span className="text-gray-700">Total (incl. tax)</span>
                                  <span className="text-amber-600 text-base">
                                    ${order.totalAmount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Customer & Delivery Info
                              </p>
                              <div className="bg-white rounded-xl border border-amber-100 p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Name</span>
                                  <span className="font-semibold text-gray-900">
                                    {order.user?.name || "N/A"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Email</span>
                                  <span className="font-semibold text-gray-900 text-xs">
                                    {order.user?.email || "N/A"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Payment</span>
                                  <span className="font-semibold text-gray-900">Online</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Delivery</span>
                                  <span className="font-semibold text-gray-900">
                                    Standard (2–3 days)
                                  </span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-50">
                                  <span className="text-gray-400">Order ID</span>
                                  <span className="font-mono text-xs text-gray-500">
                                    {order._id}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ── SECTION: CUSTOMERS ────────────────────────────────────────────────
  const renderCustomers = () => (
    <div className="space-y-5">
      {/* Search + Stats */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-amber-400 bg-white w-72 transition-all"
          />
        </div>
        <div className="text-sm text-gray-400 ml-auto">
          <strong className="text-gray-700">{filteredCustomers.length}</strong> customers found
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No customers match your search</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCustomers.map((u) => {
            const orderCount = customerOrderCounts[u._id] || 0;
            const loyaltyPts = orderCount * 10;
            const initials = getInitials(u.name);
            const color = getAvatarColor(u.name);
            const totalSpent = orders
              .filter((o) => o.user?._id === u._id && o.status !== "declined")
              .reduce((s, o) => s + o.totalAmount, 0);
            return (
              <div
                key={u._id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                      <p className="text-xs text-gray-400 max-w-[160px] truncate">{u.email}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-gray-50">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{orderCount}</p>
                    <p className="text-xs text-gray-400">Orders</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-500">⭐ {loyaltyPts}</p>
                    <p className="text-xs text-gray-400">Points</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">${totalSpent.toFixed(0)}</p>
                    <p className="text-xs text-gray-400">Spent</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1">
                    {loyaltyPts >= 50 && (
                      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                        🥇 Gold
                      </span>
                    )}
                    {orderCount > 1 && loyaltyPts < 50 && (
                      <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full font-semibold">
                        Repeat buyer
                      </span>
                    )}
                  </div>
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition"
                      title="Delete customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── SECTION: ANALYTICS ────────────────────────────────────────────────
  const renderAnalytics = () => {
    const avgOrderValue =
      activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;
    const acceptanceRate =
      orders.length > 0 ? Math.round((acceptedOrders.length / orders.length) * 100) : 0;
    const repeatCustomers = Object.values(customerOrderCounts).filter((c) => c > 1).length;

    return (
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Avg Order Value", value: `$${avgOrderValue.toFixed(2)}`, icon: "💰" },
            { label: "Acceptance Rate", value: `${acceptanceRate}%`, icon: "✅" },
            { label: "Repeat Customers", value: String(repeatCustomers), icon: "🔁" },
            { label: "Total Products", value: String(products.length), icon: "📦" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all"
            >
              <span className="text-2xl">{kpi.icon}</span>
              <p className="text-2xl font-bold text-gray-900 mt-3">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Revenue Line Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900">Revenue Trend</h3>
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                Sample data
              </span>
            </div>
            {/* Chart placeholder */}
            <div className="h-48 flex items-center justify-center text-gray-300">
              <LineChart className="w-12 h-12" />
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Revenue by Category</h3>
            </div>
            {categoryRevenueData.length > 0 ? (
              <div className="space-y-4">
                {categoryRevenueData.map((cat, i) => {
                  const maxVal = Math.max(...categoryRevenueData.map((c) => c.value), 1);
                  const pct = Math.round((cat.value / maxVal) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-24 truncate capitalize font-medium">
                        {cat.label}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-16 text-right">
                        ${cat.value.toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-300">
                <BarChart2 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs">Add products to see category data</p>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Insights — uses real stock from DB */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Inventory Insights</h3>
              <p className="text-xs text-gray-400">Live stock levels from database</p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.slice(0, 9).map((p, i) => {
                const stock = mockStockLevels[i % mockStockLevels.length];
                const isOut = stock === 0;
                const isLow = !isOut && stock <= 3;
                const statusLabel = isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock";
                const cardCls = isOut
                  ? "border-red-200 bg-red-50"
                  : isLow
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-100 bg-emerald-50/50";
                const textCls = isOut
                  ? "text-red-600"
                  : isLow
                  ? "text-amber-700"
                  : "text-emerald-700";
                return (
                  <div
                    key={p._id}
                    className={`rounded-xl border p-3 flex items-center gap-3 ${cardCls}`}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImg;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className={`text-xs font-semibold ${textCls}`}>
                        {statusLabel} · {stock} left
                      </p>
                    </div>
                    {(isOut || isLow) && (
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${textCls}`} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-300">
              <Package className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs">No products to show inventory for</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── SECTION: SETTINGS ─────────────────────────────────────────────────
  const renderSettings = () => (
    <div className="space-y-5 max-w-3xl">
      {/* Store Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <Store className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="font-bold text-gray-900">Store Information</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Store Name", value: storeName, setter: setStoreName, placeholder: "Artisan Crumbs" },
            { label: "Contact Email", value: storeEmail, setter: setStoreEmail, placeholder: "hello@example.com" },
            { label: "Phone Number", value: storePhone, setter: setStorePhone, placeholder: "+1 (555) 000-0000" },
            { label: "Address", value: storeAddress, setter: setStoreAddress, placeholder: "123 Baker Street" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <input
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                type="text"
                placeholder={f.placeholder}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-amber-400 transition-all"
              />
            </div>
          ))}
        </div>
        {settingsSaved && (
          <div className="mt-4 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 flex items-center gap-2">
            <Check className="w-3.5 h-3.5" /> Settings saved successfully!
          </div>
        )}
        <button
          className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-all shadow-sm shadow-amber-200"
          onClick={() => {
            setSettingsSaved(true);
            setTimeout(() => setSettingsSaved(false), 3000);
          }}
        >
          Save Changes
        </button>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-5">Payment Methods</h3>
        <div className="space-y-3">
          {[
            {
              label: "PayPal",
              desc: "Accept PayPal payments",
              icon: "🅿️",
              state: paypalEnabled,
              setter: () => setPaypalEnabled((v) => !v),
            },
            {
              label: "Stripe",
              desc: "Credit & debit cards via Stripe",
              icon: "💳",
              state: stripeEnabled,
              setter: () => setStripeEnabled((v) => !v),
            },
            {
              label: "Cash on Delivery",
              desc: "Pay when your order arrives",
              icon: "💵",
              state: cashEnabled,
              setter: () => setCashEnabled((v) => !v),
            },
          ].map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{m.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{m.label}</p>
                  <p className="text-xs text-gray-400">{m.desc}</p>
                </div>
              </div>
              <Toggle on={m.state} onChange={m.setter} />
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Options */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-5">Delivery Options</h3>
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
            <p className="text-xs text-gray-400">Enable free delivery for all orders</p>
          </div>
          <Toggle on={freeDelivery} onChange={() => setFreeDelivery((v) => !v)} />
        </div>
        {!freeDelivery && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Standard Delivery Fee ($)
            </label>
            <input
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              type="number"
              min="0"
              step="0.50"
              className="w-40 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-amber-400 transition-all"
            />
          </div>
        )}
      </div>

      {/* User Roles & Permissions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="font-bold text-gray-900">User Roles & Permissions</h3>
        </div>
        {users.length > 0 ? (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${getAvatarColor(u.name)} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
                  >
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>
                <select
                  value={u.role}
                  onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-amber-400 bg-white font-semibold text-gray-700 cursor-pointer"
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No users to manage</p>
        )}
      </div>
    </div>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FBF8F4] flex font-sans">
      {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-16"
        } flex-shrink-0 bg-stone-900 flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
        style={{ minHeight: "100vh" }}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 border-b border-stone-800 px-4 gap-3 ${
            sidebarOpen ? "" : "justify-center"
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-900/30">
            <span className="text-lg leading-none">🍰</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-bold text-sm leading-tight">Artisan Crumbs</p>
              <p className="text-stone-500 text-xs">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left relative group ${
                  isActive
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-900/20"
                    : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                } ${sidebarOpen ? "" : "justify-center"}`}
                title={!sidebarOpen ? item.label : ""}
              >
                <span className="flex-shrink-0 relative">
                  {item.icon}
                  {!sidebarOpen && item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </span>
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-semibold flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                          isActive ? "bg-white/20 text-white" : "bg-amber-500 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-stone-800">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition-all ${
              sidebarOpen ? "" : "justify-center"
            }`}
          >
            <Menu className="w-[18px] h-[18px] flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-semibold">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── TOPBAR ────────────────────────────────────────────────── */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-6 flex-shrink-0 sticky top-0 z-30">
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 capitalize text-base">{activeSection}</h2>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="notif-bell"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              {pendingOrders.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotifOpen(false)}
                />
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                    <p className="font-bold text-sm text-gray-900">Notifications</p>
                    {pendingOrders.length > 0 && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        {pendingOrders.length} new
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {pendingOrders.length > 0 ? (
                      pendingOrders.slice(0, 6).map((o) => (
                        <div key={o._id} className="px-5 py-3.5 hover:bg-amber-50/40 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                New order from {o.user?.name || "Guest"}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                ${o.totalAmount.toFixed(2)} ·{" "}
                                {new Date(o.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-8 text-center text-sm text-gray-400">
                        <Bell className="w-6 h-6 mx-auto mb-2 text-gray-200" />
                        No new notifications
                      </div>
                    )}
                  </div>
                  {pendingOrders.length > 0 && (
                    <div className="px-5 py-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setActiveSection("orders");
                          setNotifOpen(false);
                        }}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        View all orders →
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
            <div
              className={`w-9 h-9 rounded-xl ${getAvatarColor(authUser?.name || "Admin")} flex items-center justify-center text-white font-bold text-xs shadow-sm`}
            >
              {getInitials(authUser?.name || "Admin")}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-900 leading-tight">
                {authUser?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Error Banner */}
          {message && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{message}</span>
              <button
                onClick={() => setMessage("")}
                className="ml-auto hover:text-red-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading dashboard data…</p>
            </div>
          ) : (
            <>
              {activeSection === "overview" && renderOverview()}
              {activeSection === "products" && renderProducts()}
              {activeSection === "orders" && renderOrders()}
              {activeSection === "customers" && renderCustomers()}
              {activeSection === "analytics" && renderAnalytics()}
              {activeSection === "settings" && renderSettings()}
            </>
          )}
        </main>
      </div>

      {/* ── PRODUCT MODAL ─────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {modalMode === "add" ? "✨ Add New Product" : "✏️ Edit Product"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {modalMode === "add"
                    ? "Fill in the details to list a new product"
                    : "Update the product information below"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 py-6">
              {errorMsg && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-all"
                    placeholder="e.g. Chocolate Fudge Cake"
                  />
                </div>

                {/* Price + Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-all"
                      placeholder="24.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={pCat}
                      onChange={(e) => setPCat(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-all bg-white"
                    >
                      <option value="">Select category…</option>
                      <option value="Cakes">🎂 Cakes</option>
                      <option value="Pastries">🥐 Pastries</option>
                      <option value="Bread">🍞 Bread</option>
                      <option value="Muffins">🧁 Muffins</option>
                      <option value="Cookies">🍪 Cookies</option>
                      <option value="Pies">🥧 Pies</option>
                    </select>
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-all"
                    placeholder="0"
                  />
                </div>

                {/* Image — URL or File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Product Image *
                  </label>
                  {/* Toggle between URL and file upload */}
                  <div className="flex rounded-lg bg-gray-100 p-0.5 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("image-url-input") as HTMLElement | null;
                        if (el) el.style.display = "";
                        const el2 = document.getElementById("image-file-input") as HTMLElement | null;
                        if (el2) el2.style.display = "none";
                      }}
                      className="flex-1 py-1.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-white hover:shadow-sm transition-all text-center"
                    >
                      🔗 Paste URL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("image-url-input") as HTMLElement | null;
                        if (el) el.style.display = "none";
                        const el2 = document.getElementById("image-file-input") as HTMLElement | null;
                        if (el2) el2.style.display = "";
                      }}
                      className="flex-1 py-1.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-white hover:shadow-sm transition-all text-center"
                    >
                      📁 Upload File
                    </button>
                  </div>
                  {/* URL input */}
                  <div id="image-url-input">
                    <input
                      type="text"
                      value={pImage.startsWith("data:") ? "" : pImage}
                      onChange={(e) => setPImage(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-all"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  {/* File input */}
                  <div id="image-file-input" style={{ display: "none" }}>
                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-5 px-4 cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">Click to choose an image</span>
                      <span className="text-xs text-gray-400">JPG, PNG, WEBP — max 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("Image must be under 5MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            setPImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                  {/* Image Preview */}
                  {pImage && (
                    <div className="mt-2 relative group">
                      <img
                        src={pImage}
                        alt="preview"
                        className="h-28 w-full object-cover rounded-xl border border-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setPImage("")}
                        className="absolute top-2 right-2 p-1 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-all resize-none"
                    placeholder="Describe this product…"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tags{" "}
                    <span className="text-gray-400 font-normal">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={pTags}
                    onChange={(e) => setPTags(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-all"
                    placeholder="e.g. vegan, gluten-free, bestseller"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition-all shadow-sm shadow-amber-200"
                  >
                    {modalMode === "add" ? "Create Product" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
