import { Material, MaterialInitialState } from "@/type/type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const defaultMaterial: Material = {
  id: "",
  sloc: 6101,
  code: 191390029,
  name: "",
  unit: "EA",
  bringForward: 0,
  stockIn: 0,
  stockOut: 0,
  balance: 0,
  stockCount: 0,
  note: "",
  createDate: new Date(),
  modifyDate: new Date(),
};

const initialState: MaterialInitialState = {
  loading: false,
  material: [],
  currentMaterial: { ...defaultMaterial },
  failed: false,
};

export const getAllMaterial = createAsyncThunk(
  "materialSlice/getAllMaterial",
  async () => {
    const { data } = await axios.get("/api/admin/material");
    return data;
  }
);

export const getMaterial = createAsyncThunk(
  "materialSlice/getMaterial",
  async (id: string) => {
    const { data } = await axios.get(`/api/admin/material/${id}`);
    return data;
  }
);

export const createMaterial = createAsyncThunk(
  "materialSlice/createMaterial",
  async (material: Material) => {
    const { data } = await axios.post("/api/admin/material", material);
    return data;
  }
);

export const editMaterial = createAsyncThunk(
  "materialSlice/editMaterial",
  async (material: Material) => {
    const { data } = await axios.put(
      `/api/admin/material/${material.id}`,
      material
    );
    return data;
  }
);

export const deleteMaterial = createAsyncThunk(
  "materialSlice/deleteMaterial",
  async (id: string) => {
    const { data } = await axios.delete(`/api/admin/material/${id}`);
    return data;
  }
);

export const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.material = action.payload;
      })
      .addCase(getMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMaterial = action.payload;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        const newMaterial = [action.payload, ...state.material];
        state.loading = false;
        state.material = newMaterial;
      })
      .addCase(editMaterial.fulfilled, (state, action) => {
        const updatedMaterial = state.material.map((material) =>
          material.id === action.payload.id ? action.payload : material
        );
        state.loading = false;
        state.material = updatedMaterial;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        const filterMaterial = state.material.filter(
          (material) => material.id !== action.payload
        );
        state.loading = false;
        state.material = filterMaterial;
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") && action.type.includes("authSlice"),
        (state) => {
          state.loading = true;
          state.failed = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          action.type.includes("authSlice"),
        (state) => {
          state.loading = false;
          state.failed = true;
        }
      );
  },
});

export default materialSlice.reducer;
