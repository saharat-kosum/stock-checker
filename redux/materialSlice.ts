import { CurrentPayload, Material, MaterialInitialState } from "@/type/type";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

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
  material: [defaultMaterial, defaultMaterial],
  currentMaterial: { ...defaultMaterial },
  failed: false,
  totalPages: 1,
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
  reducers: {
    setCurrentMat: (state, action: PayloadAction<CurrentPayload>) => {
      const { name, value } = action.payload;
      if (
        typeof state.currentMaterial[name] === "string" &&
        typeof value === "string"
      ) {
        (state.currentMaterial[name] as string) = value;
      }
      if (
        typeof state.currentMaterial[name] === "number" &&
        typeof value === "number"
      ) {
        (state.currentMaterial[name] as number) = value;
      }
    },
  },
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
        state.loading = false;
        state.material.unshift(action.payload);
      })
      .addCase(editMaterial.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.material.findIndex(
          (material) => material.id === action.payload.id
        );
        if (index !== -1) {
          state.material[index] = action.payload;
        }
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.material = state.material.filter(
          (material) => material.id !== action.payload
        );
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") &&
          action.type.includes("materialSlice"),
        (state) => {
          state.loading = true;
          state.failed = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          action.type.includes("materialSlice"),
        (state) => {
          state.loading = false;
          state.failed = true;
        }
      );
  },
});

export const { setCurrentMat } = materialSlice.actions;
export default materialSlice.reducer;
