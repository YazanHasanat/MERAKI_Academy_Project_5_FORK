import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice"
export const store = configureStore({
  reducer: {
    categories: categoryReducer,
  },
})

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
