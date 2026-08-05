import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string | number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = "cartItems";

function loadCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate each entry has the expected shape
    return parsed.filter(
      (item: any) =>
        item &&
        (typeof item.productId === "string" || typeof item.productId === "number") &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

const initialState: CartState = {
  items: loadCartItems(),
};

const cartSlicer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<string | number>) => {
      const existing = state.items.find(
        (item) => item.productId === action.payload,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ productId: action.payload, quantity: 1 });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
      saveCart(state.items);
    },
    incrementQuantity: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find(
        (item) => item.productId === action.payload,
      );
      if (item) {
        item.quantity += 1;
      }
      saveCart(state.items);
    },
    decrementQuantity: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find(
        (item) => item.productId === action.payload,
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      saveCart(state.items);
    },
    removeAllFromCart: (state) => {
      state.items = [];
      localStorage.removeItem(CART_STORAGE_KEY);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  removeAllFromCart,
} = cartSlicer.actions;
export default cartSlicer.reducer;


