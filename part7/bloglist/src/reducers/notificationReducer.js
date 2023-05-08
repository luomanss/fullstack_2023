import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    removeNotification(_state, _action) {
      return null;
    },
  },
});

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const setNotificationWithTimeoutSeconds = (notification, time) => {
  return async (dispatch) => {
    dispatch(setNotification(notification));
    await sleep(time * 1000);
    dispatch(removeNotification());
  };
};

export const { setNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
