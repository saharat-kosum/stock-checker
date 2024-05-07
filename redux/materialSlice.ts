import {
  CurrentPayload,
  GetMaterialProps,
  Material,
  MaterialInitialState,
} from "@/type/type";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";
import * as XLSX from "xlsx";

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
  createDate: "",
  modifyDate: "",
};

const initialState: MaterialInitialState = {
  loading: false,
  material: [],
  currentMaterial: { ...defaultMaterial },
  failed: false,
  totalPages: 1,
  defaultMaterial: { ...defaultMaterial },
};

export const getAllMaterial = createAsyncThunk(
  "materialSlice/getAllMaterial",
  async ({ select, currentPage, search, all }: GetMaterialProps) => {
    const { data } = await axios.get(`/api/material`, {
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

export const getMaterial = createAsyncThunk(
  "materialSlice/getMaterial",
  async (url: string) => {
    const { data } = await axios.get(`${url}`);
    return data;
  }
);

export const createMaterial = createAsyncThunk(
  "materialSlice/createMaterial",
  async (material: Material) => {
    const { data } = await axios.post("/api/material", material);
    return data;
  }
);

export const editMaterial = createAsyncThunk(
  "materialSlice/editMaterial",
  async (material: Material) => {
    const { data } = await axios.put(`/api/material/${material.id}`, material);
    return data;
  }
);

export const deleteMaterial = createAsyncThunk(
  "materialSlice/deleteMaterial",
  async (id: string) => {
    const { data } = await axios.delete(`/api/material/${id}`);
    return data;
  }
);

export const excelEdit = createAsyncThunk(
  "materialSlice/editMaterialByExcel",
  async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(new Uint8Array(data as ArrayBuffer), {
            type: "array",
          });
          // SheetName
          const sheetName = workbook.SheetNames[0];
          // Worksheet
          const workSheet = workbook.Sheets[sheetName];
          // Json
          const json = XLSX.utils.sheet_to_json(workSheet);
          try {
            const response = await axios.post("/api/material/excel", json);
            resolve(response.data);
          } catch (error) {
            reject(error);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    });
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
    setFailed: (state) => {
      state.failed = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.material = action.payload.materials;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMaterial = action.payload;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.material.unshift(action.payload);
        state.currentMaterial = { ...defaultMaterial };
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
          (material) => material.id !== action.payload.id
        );
      })
      .addCase(excelEdit.fulfilled, (state) => {
        state.loading = false;
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

export const { setCurrentMat, setFailed } = materialSlice.actions;
export default materialSlice.reducer;
