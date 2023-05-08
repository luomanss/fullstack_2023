import { useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import AppContext from "../AppContext";
import loginService from "../services/auth";
import Notification from "./Notification";
import Togglable from "./Togglable";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import { getAll } from "../reducers/blogsReducer";

const Main = ({ onLogout }) => {
  const blogs = useSelector((state) => {
    const blogs = state.blogs.toSorted((a, b) => b.likes - a.likes);

    return blogs;
  });
  const { user } = useContext(AppContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAll());
  }, []);

  const handleLogout = () => {
    loginService.logout();

    onLogout();
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

Main.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Main;
