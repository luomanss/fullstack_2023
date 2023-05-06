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

const { setNotification, clearNotification } = slice.actions;

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const setNotificationWithTimeout = (message, timeoutSeconds = 5) => {
  return async (dispatch) => {
    dispatch(setNotification(message));
    await sleep(timeoutSeconds * 1000);
    dispatch(clearNotification());
  };
};

export default slice.reducer;
