import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

const { setUsers } = usersSlice.actions;

export const getAll = () => {
  return async (dispatch) => {
    const users = await usersService.getAll();

    dispatch(setUsers(users));
  };
};

export default usersSlice.reducer;
