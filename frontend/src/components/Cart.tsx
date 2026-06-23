import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../features/cart";
import { data } from "../data";
import { Link, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";

interface RootState {
  cart: {
    items: Array<{
      productId: string | number;
      quantity: number;
    }>;
  };
}

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  // Find product details for each cart item
  const cartProducts = cartItems
    .map((cartItem) => {
      for (const category of data.categories) {
        const product = category.products.find(
          (p) => p.id === cartItem.productId,
        );
        if (product) {
          return { ...product, quantity: cartItem.quantity };
        }
      }
      return null;
    })
    .filter((item) => item !== null);

  const totalPrice = cartProducts.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 1),
    0,
  );

  const handleRemove = (productId: string | number) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <section className="py-9 px-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link
          to={`/shop?filter=${filter}`}
          className="text-[#F59E0B] font-medium text-sm mb-6 inline-block hover:underline"
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
              className="inline-block bg-[#F59E0B] text-gray-900 font-medium py-2.5 px-6 rounded-full hover:bg-[#D97706] transition-colors"
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
                    key={item?.id}
                    className="flex gap-4 p-5 border-b border-gray-200 last:border-b-0"
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
                        <span className="text-sm text-gray-600">
                          Qty: {item?.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item?.id || 0)}
                      className="text-[#64748B] hover:text-red-600 transition-colors p-2"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
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
                <button className="w-full bg-gray-900 text-white font-medium py-3 rounded-full hover:bg-gray-800 transition-colors mb-3">
                  Checkout
                </button>
                <Link
                  to="/shop"
                  className="block text-center text-[#334155] font-medium py-2.5 hover:bg-gray-100 rounded-full transition-colors"
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
