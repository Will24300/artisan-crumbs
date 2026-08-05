import { describe, it, expect } from "vitest";
import cartReducer, {
  addToCart,
  removeFromCart,
} from "./cart.js";

describe("cart reducer", () => {
  it("should handle initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual({ items: [] });
  });

  it("should handle addToCart", () => {
    const state = cartReducer({ items: [] }, addToCart("product-1"));
    expect(state.items).toEqual([{ productId: "product-1", quantity: 1 }]);
  });

  it("should increment quantity on repeated addToCart", () => {
    const initial = { items: [{ productId: "product-1", quantity: 1 }] };
    const state = cartReducer(initial, addToCart("product-1"));
    expect(state.items).toEqual([{ productId: "product-1", quantity: 2 }]);
  });

  it("should handle removeFromCart", () => {
    const initial = { items: [{ productId: "product-1", quantity: 2 }] };
    const state = cartReducer(initial, removeFromCart("product-1"));
    expect(state.items).toEqual([]);
  });
});
