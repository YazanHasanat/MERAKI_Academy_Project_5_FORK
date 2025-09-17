import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image_url: string;
}

interface CategoryState {
  items: Category[];
}

const initialState: CategoryState = {
  items: [],
};

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload);
    },
    updateCategoryById: (state, action: PayloadAction<Category>) => {
      const updatedCategory = action.payload;
      const index = state.items.findIndex((cat) => cat._id === updatedCategory._id);
      if (index !== -1) state.items[index] = updatedCategory;
    },
    deleteCategoryById: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter((cat) => cat._id !== id);
    },
  },
});

export const { setCategories, addCategory, updateCategoryById, deleteCategoryById } =
  categorySlice.actions;

export default categorySlice.reducer;
