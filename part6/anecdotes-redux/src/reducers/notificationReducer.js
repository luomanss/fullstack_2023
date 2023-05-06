import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      return action.payload;
    },
    clearNotification: (state, action) => {
      return null;
    }
  },
});

export const { setNotification, clearNotification } = slice.actions;
export default slice.reducer;
