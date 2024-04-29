import { AuthInitialState } from "@/type/type";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: AuthInitialState = {
  loading: false,
  error: null,
  success: false,
};

export const login = createAsyncThunk(
  "authSlice/login",
  async (user: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/admin/login", user);
      if (response.status !== 200) {
        return rejectWithValue({ message: "Login failed" });
      }
      return response.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk("authSlice/logout", async () => {
  const { data } = await axios.post("/api/admin/logout");
  return data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") && action.type.includes("authSlice"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is PayloadAction<any, string, any, any> =>
          action.type.endsWith("/rejected") &&
          action.type.includes("authSlice"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload.error;
        }
      );
  },
});

export default authSlice.reducer;
