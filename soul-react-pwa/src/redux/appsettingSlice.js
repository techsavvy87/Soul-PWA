import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isShowPlan: false,
  readingId: null,
  cardId: null,
  cards: [],
  readings: [],
  prevPageName: "",
  elementEmpty: false,
  Info: { app: "", meditation: "" },
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
    setElementEmpty(state, action) {
      state.elementEmpty = action.payload.elementEmpty;
    },
    setInfo(state, action) {
      state.Info = {
        ...state.Info,
        ...action.payload.Info,
      };
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
  setElementEmpty,
  setInfo,
} = appsettingSlice.actions;

export default appsettingSlice.reducer;
