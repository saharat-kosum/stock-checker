import {
  GetStockCountProps,
  StockCountInitialState,
  StockCountWithMaterial,
} from "@/type/type";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

const defaultMaterial = {
  id: "",
  sloc: 6101,
  code: 0,
  name: "",
  unit: "EA",
  bringForward: 0,
  stockIn: 0,
  stockOut: 0,
  balance: 0,
  stockCount: 0,
  note: "",
  createDate: "",
  modifyDate: "",
};

const defaultStockCount: StockCountWithMaterial = {
  id: 0,
  stockCode: "",
  materialId: "",
  countedQty: 0,
  systemQty: 0,
  countedDate: "",
  createdDate: "",
  lastUpdated: "",
  note: null,
  material: { ...defaultMaterial },
};

const initialState: StockCountInitialState = {
  loading: false,
  stockCounts: [],
  allStockCounts: [],
  currentStockCount: { ...defaultStockCount },
  failed: false,
  totalPages: 1,
  defaultStockCount: { ...defaultStockCount },
};

export const getAllStockCount = createAsyncThunk(
  "stockCountSlice/getAllStockCount",
  async ({ select, currentPage, search, all }: GetStockCountProps) => {
    const { data } = await axios.get(`/api/stockCount`, {
      params: {
        currentpage: currentPage,
        search,
        orderby: select.order,
        sort: select.sort,
        itemperpage: select.itemsPerPage,
        all,
      },
    });
    return data;
  }
);

export const getStockCount = createAsyncThunk(
  "stockCountSlice/getStockCount",
  async (id: number) => {
    const { data } = await axios.get(`/api/stockCount/${id}`);
    return data;
  }
);

type UpdateStockCountPayload = {
  id: number;
  stockCode?: string;
  materialId?: string;
  countedQty?: number;
  systemQty?: number;
  countedDate?: string;
  note?: string | null;
};

export const updateStockCount = createAsyncThunk(
  "stockCountSlice/updateStockCount",
  async ({ id, ...payload }: UpdateStockCountPayload) => {
    const { data } = await axios.put(`/api/stockCount/${id}`, payload);
    return data;
  }
);

export const deleteStockCount = createAsyncThunk(
  "stockCountSlice/deleteStockCount",
  async (id: number) => {
    const { data } = await axios.delete(`/api/stockCount/${id}`);
    return data;
  }
);

export const stockCountSlice = createSlice({
  name: "stockCount",
  initialState,
  reducers: {
    setCurrentStockCount: (
      state,
      action: PayloadAction<StockCountWithMaterial>
    ) => {
      state.currentStockCount = action.payload;
    },
    setStockCountFailed: (state) => {
      state.failed = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllStockCount.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.all) {
          state.allStockCounts = action.payload.stockCounts;
        } else {
          state.stockCounts = action.payload.stockCounts;
          state.totalPages = action.payload.totalPages || 1;
        }
      })
      .addCase(getStockCount.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStockCount = action.payload;
      })
      .addCase(updateStockCount.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStockCount = action.payload;
        const index = state.stockCounts.findIndex(
          (stockCount) => stockCount.id === action.payload.id
        );
        if (index !== -1) {
          state.stockCounts[index] = action.payload;
        }
        const allIndex = state.allStockCounts.findIndex(
          (stockCount) => stockCount.id === action.payload.id
        );
        if (allIndex !== -1) {
          state.allStockCounts[allIndex] = action.payload;
        }
      })
      .addCase(deleteStockCount.fulfilled, (state, action) => {
        state.loading = false;
        state.stockCounts = state.stockCounts.filter(
          (stockCount) => stockCount.id !== action.payload.id
        );
        state.allStockCounts = state.allStockCounts.filter(
          (stockCount) => stockCount.id !== action.payload.id
        );
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") &&
          action.type.includes("stockCountSlice"),
        (state) => {
          state.loading = true;
          state.failed = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          action.type.includes("stockCountSlice"),
        (state) => {
          state.loading = false;
          state.failed = true;
        }
      );
  },
});

export const { setCurrentStockCount, setStockCountFailed } =
  stockCountSlice.actions;
export default stockCountSlice.reducer;
