import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE } from "../utils/api";

export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags?: string[];
  stock: number;
}

interface ProductsState {
  items: ApiProduct[];
  topSelling: ApiProduct[];
  loading: boolean;
  topSellingLoading: boolean;
  error: string | null;
  loaded: boolean;
  topSellingLoaded: boolean;
}

const initialState: ProductsState = {
  items: [],
  topSelling: [],
  loading: false,
  topSellingLoading: false,
  error: null,
  loaded: false,
  topSellingLoaded: false,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      if (!response.ok) {
        throw new Error("Unable to fetch products");
      }
      const data = await response.json();
      return (data || []).map((product: any) => {
        const rawStock =
          product.stock ?? product.countInStock ?? product.quantity ?? 0;
        return {
          ...product,
          stock: Number(rawStock) || 0,
        } as ApiProduct;
      });
    } catch (err: any) {
      return rejectWithValue(err.message || "Error loading products");
    }
  }
);

export const fetchTopSelling = createAsyncThunk(
  "products/fetchTopSelling",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/products/top-selling`);
      if (!response.ok) {
        throw new Error("Unable to fetch top-selling products");
      }
      const data = await response.json();
      return (data || []).map((product: any) => {
        const rawStock =
          product.stock ?? product.countInStock ?? product.quantity ?? 0;
        return {
          ...product,
          stock: Number(rawStock) || 0,
        } as ApiProduct;
      });
    } catch (err: any) {
      return rejectWithValue(err.message || "Error loading top-selling products");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    invalidateProducts: (state) => {
      state.loaded = false;
      state.topSellingLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        if (!state.loaded) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.loaded = true;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load products";
      })
      .addCase(fetchTopSelling.pending, (state) => {
        if (!state.topSellingLoaded) {
          state.topSellingLoading = true;
        }
      })
      .addCase(fetchTopSelling.fulfilled, (state, action) => {
        state.topSelling = action.payload;
        state.topSellingLoading = false;
        state.topSellingLoaded = true;
      })
      .addCase(fetchTopSelling.rejected, (state) => {
        state.topSellingLoading = false;
      });
  },
});

export const { invalidateProducts } = productsSlice.actions;
export default productsSlice.reducer;
