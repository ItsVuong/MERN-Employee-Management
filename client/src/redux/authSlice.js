import { createSlice } from "@reduxjs/toolkit";

const tokenFromStorage = localStorage.getItem("token");

const initialState = {
  token: tokenFromStorage || null,
  isAuthenticated: !!tokenFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload); // Save token to localStorage
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token"); // Remove token from localStorage
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
