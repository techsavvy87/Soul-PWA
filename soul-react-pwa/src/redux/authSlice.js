import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  tier: "free", // Default tier
  subscription: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { isAuthenticated, user, token, tier, subscription } =
        action.payload;
      state.isAuthenticated = isAuthenticated;
      state.user = user;
      state.token = token;
      state.tier = tier;
      state.subscription = subscription;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.tier = "free";
      state.subscription = null;
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
