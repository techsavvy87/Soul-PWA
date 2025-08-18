import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore } from "@reduxjs/toolkit";
import appsettingReducer from "../redux/appsettingSlice";
import authReducer from "../redux/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appsetting: appsettingReducer,
  },
  devTools: true,
});
