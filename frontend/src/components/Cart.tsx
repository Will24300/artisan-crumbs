import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  removeAllFromCart,
} from "../features/cart";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { X, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

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

  // Suppress unused variable warnings
  void loading;
  void error;
  const navigate = useNavigate();

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
          return { ...product, stock: Number(rawStock) || 0 } as ApiProduct;
        }));
        setError(null);
      })
      .catch(() => setError("Failed to load product details."))
      .finally(() => setLoading(false));
  }, []);

  // Find product details for each cart item
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
      totalAmount: totalPrice * 1.1, // Total including tax (subtotal * 1.1)
    };

    try {
      const res = await fetch("/api/orders", {
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

      toast.success("Order placed successfully!");
      dispatch(removeAllFromCart());
      navigate("/");
    } catch {
      toast.error("Unable to connect to the server.");
    }
  };

  return (
    <section className="py-9 px-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link
          to={`/shop?filter=${filter}`}
          className="cursor-pointer text-[#F59E0B] font-medium text-sm mb-6 inline-block hover:underline"
        >
          ← Back to Shop
        </Link>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-9">
          Shopping <span className="text-[#F59E0B]">Cart</span>
        </h1>

        {cartProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#64748B] text-lg mb-4">Your cart is empty</p>
            <Link
              to="/shop"
              className="cursor-pointer inline-block bg-[#F59E0B] text-gray-900 font-medium py-2.5 px-6 rounded-full hover:bg-[#D97706] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-9">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {cartProducts.map((item) => (
                  <div
                    key={item?._id}
                    className="flex gap-4 p-5 border-b border-gray-200 last:border-b-0 items-center"
                  >
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item?.name}
                      </h3>
                      <p className="text-xs text-[#64748B] mb-2">
                        {item?.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#F59E0B] font-bold">
                          ${(item?.price || 0).toFixed(2)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                          <button
                            onClick={() => handleDecrement(item?._id || 0)}
                            className="cursor-pointer p-1 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} className="text-gray-600" />
                          </button>
                          <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                            {item?.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item?._id || 0)}
                            className="cursor-pointer p-1 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item?._id || 0)}
                      className="cursor-pointer text-[#64748B] hover:text-red-600 transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              {cartProducts.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="cursor-pointer mt-4 text-red-600 font-medium text-sm hover:text-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-4">
                <h2 className="font-bold text-lg text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B]">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B]">Shipping</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B]">Tax</span>
                    <span className="font-medium text-gray-900">
                      ${(totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-[#F59E0B] text-lg">
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
                  className="cursor-pointer w-full bg-gray-900 text-white font-medium py-3 rounded-full hover:bg-gray-800 transition-colors mb-3"
                >
                  Checkout
                </button>
                <Link
                  to="/shop"
                  className="cursor-pointer block text-center text-[#334155] font-medium py-2.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;
