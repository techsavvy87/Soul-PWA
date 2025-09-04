import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isShowPlan: false,
  readingId: null,
  cardId: null,
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
    setActiveReadingId(state, action) {
      state.readingId = action.payload.readingId;
    },
    setActiveCardId(state, action) {
      state.cardId = action.payload.cardId;
    },
  },
});

export const {
  setIsLoading,
  setIsShowPlan,
  setActiveReadingId,
  setActiveCardId,
} = appsettingSlice.actions;

export default appsettingSlice.reducer;
