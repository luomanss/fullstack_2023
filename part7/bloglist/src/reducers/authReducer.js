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

    if (response.error) {
      dispatch(
        setNotificationWithTimeoutSeconds(
          { type: "error", content: response.error },
          5
        )
      );

      return;
    }

    dispatch(setUser(response.user));
    dispatch(
      setNotificationWithTimeoutSeconds(
        {
          type: "success",
          content: `${response.user.name} logged in`,
        },
        5
      )
    );
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
    const response = authService.autoLogin();

    if (response) {
      dispatch(setUser(response.user));
    }
  };
};

export default userSlice.reducer;
