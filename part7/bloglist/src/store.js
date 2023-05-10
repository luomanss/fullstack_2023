import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogsReducer from "./reducers/blogsReducer";
import authReducer from "./reducers/authReducer";
import usersReducer from "./reducers/usersReducer";
import * as notificationActions from "./reducers/notificationReducer";
import * as blogsActions from "./reducers/blogsReducer";
import * as authActions from "./reducers/authReducer";
import * as usersActions from "./reducers/usersReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: authReducer,
    users: usersReducer,
  },
});

export default store;
export { notificationActions, blogsActions, authActions, usersActions };
