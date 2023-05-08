import { createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth";
import { setNotificationWithTimeoutSeconds } from "./notificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    removeUser(_state, _action) {
      return null;
    },
  },
});

const { setUser, removeUser } = userSlice.actions;

export const login = (user) => {
  return async (dispatch) => {
    const response = await authService.login(user);

    console.log(response);

    if (response.error) {
      dispatch(
        setNotificationWithTimeoutSeconds(
          { type: "error", content: response.error },
          5
        )
      );

      return;
    }

    dispatch(setUser(user));
  };
};

export const logout = () => {
  return async (dispatch) => {
    authService.logout();

    dispatch(removeUser());
  };
};

export const autoLogin = () => {
  return async (dispatch) => {
    const user = authService.autoLogin();

    if (user) {
      dispatch(setUser(user));
    }
  };
};

export default userSlice.reducer;