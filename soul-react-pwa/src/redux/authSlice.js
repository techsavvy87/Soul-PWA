import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  tier: null,
  plan_ended_date: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.tier = null;
      state.plan_ended_date = null;
    },
    updateUser(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
