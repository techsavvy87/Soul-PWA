import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isShowPlan: false,
  readingId: null,
  cardId: null,
  cards: [],
  readings: [],
  prevPageName: "",
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
    setExtraCards(state, action) {
      state.cards = action.payload.cards;
    },
    setExtraReadings(state, action) {
      state.readings = action.payload.readings;
    },
    setPrevPageName(state, action) {
      state.prevPageName = action.payload.pageName;
    },
  },
});

export const {
  setIsLoading,
  setIsShowPlan,
  setActiveReadingId,
  setActiveCardId,
  setExtraCards,
  setExtraReadings,
  setPrevPageName,
} = appsettingSlice.actions;

export default appsettingSlice.reducer;
