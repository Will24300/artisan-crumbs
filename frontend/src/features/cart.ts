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
        (item) => item.productId === action.payload,
      );
    },
  },
});

export const { addToCart, removeFromCart } = cartSlicer.actions;
export default cartSlicer.reducer;
