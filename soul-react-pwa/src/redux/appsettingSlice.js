import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isShowPlan: false,
};

const appsettingSlice = createSlice({
  name: "appsetting",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload.isLoading;
    },
    setIsShowPlan(state, action) {
      state.isShowPlan = action.payload.isShowPlan;
    },
  },
});

export const { setIsLoading, setIsShowPlan } = appsettingSlice.actions;

export default appsettingSlice.reducer;
