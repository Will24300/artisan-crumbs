import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string | number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
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
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
    },
    incrementQuantity: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find(
        (item) => item.productId === action.payload,
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find(
        (item) => item.productId === action.payload,
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeAllFromCart: (state) => {
      state.items = [];
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
