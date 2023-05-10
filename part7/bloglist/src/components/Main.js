import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import PropTypes from "prop-types";
// import AppContext from "../AppContext";
// import loginService from "../services/auth";
import { Outlet } from "react-router-dom";
import Notification from "./Notification";
import Togglable from "./Togglable";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import { getAll } from "../reducers/blogsReducer";
import { logout } from "../reducers/authReducer";

const Main = () => {
  const { blogs, user } = useSelector((state) => {
    const blogs = state.blogs.toSorted((a, b) => b.likes - a.likes);

    return { blogs, user: state.user };
  });
  // const { user } = useContext(AppContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAll());
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    // loginService.logout();

    // onLogout();
  };

  const blogFormRef = useRef();

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in{" "}
        <button onClick={handleLogout} data-cy="logout-button">
          logout
        </button>
      </p>
      <Outlet />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default Main;
