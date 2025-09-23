import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isShowPlan: false,
  readingId: null,
  cardId: null,
  cards: [],
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
  setPrevPageName,
} = appsettingSlice.actions;

export default appsettingSlice.reducer;
