import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogsReducer from "./reducers/blogsReducer";
import userReducer from "./reducers/authReducer";
import * as notificationActions from "./reducers/notificationReducer";
import * as blogsActions from "./reducers/blogsReducer";
import * as authActions from "./reducers/authReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: userReducer,
  },
});

export default store;
export { notificationActions, blogsActions, authActions };
