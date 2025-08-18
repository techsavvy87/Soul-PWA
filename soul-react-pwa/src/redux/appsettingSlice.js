import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const appsettingSlice = createSlice({
  name: "appsetting",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload.isLoading;
    },
  },
});

export const { setIsLoading } = appsettingSlice.actions;

export default appsettingSlice.reducer;
