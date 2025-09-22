import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import materialReducer from "./materialSlice";
import stockCountReducer from "./stockCountSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    material: materialReducer,
    stockCount: stockCountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
