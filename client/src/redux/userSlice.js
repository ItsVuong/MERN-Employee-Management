import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userId: null,
  email: null,
  role: null
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userId = null, email = null, role = null } = action.payload;
      state.userId = userId;
      state.email = email;
      state.role = role;
    },
    clearUser: (state, action) => {
      state.userId = null;
      state.email = null;
      state.role = null;
    }
  }
});
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

