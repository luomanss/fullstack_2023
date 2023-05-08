import { useState, useEffect, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import AppContext from "../AppContext";
import blogService from "../services/blogs";
import loginService from "../services/auth";
import Notification from "./Notification";
import Togglable from "./Togglable";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import { setNotificationWithTimeoutSeconds } from "../reducers/notificationReducer";

const Main = ({ onLogout }) => {
  const [blogs, setBlogs] = useState([]);
  const { user /* message, dispatchMessage */ } = useContext(AppContext);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const blogs = await blogService.getAll();

      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    })();
  }, []);

  const handleLogout = () => {
    loginService.logout();

    onLogout();
  };

  const blogFormRef = useRef();

  const handleNewBlog = async (blog) => {
    const response = await blogService.create(blog);

    if (response.error) {
      dispatch(
        setNotificationWithTimeoutSeconds(
          { type: "error", content: response.error },
          5
        )
      );
      // dispatchMessage({ type: "error", content: response.error });
      return;
    }

    const newBlog = response.blog;

    blogFormRef.current.toggleVisibility();
    setBlogs(blogs.concat(newBlog));

    dispatch(
      setNotificationWithTimeoutSeconds(
        {
          type: "success",
          content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        },
        5
      )
    );
    // dispatchMessage({
    //   type: "success",
    //   content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
    // });
  };

  const handleUpdate = async (updatedBlog, index) => {
    const result = await blogService.update(updatedBlog);

    if (result.error) {
      dispatch(
        setNotificationWithTimeoutSeconds(
          { type: "error", content: result.error },
          5
        )
      );
      // dispatchMessage({ type: "error", content: result.error });
      return;
    }

    const newBlogs = [...blogs];

    newBlogs[index] = result.blog;
    newBlogs.sort((a, b) => b.likes - a.likes);
    setBlogs(newBlogs);
  };

  const handleDelete = async (id, index) => {
    const result = await blogService.remove(id);

    if (result.error) {
      dispatch(
        setNotificationWithTimeoutSeconds(
          { type: "error", content: result.error },
          5
        )
      );
      // dispatchMessage({ type: "error", content: result.error });
      return;
    }

    const newBlogs = [...blogs];

    newBlogs.splice(index, 1);
    setBlogs(newBlogs);
  };

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
        <BlogForm onSubmit={handleNewBlog} />
      </Togglable>
      {blogs.map((blog, index) => (
        <Blog
          key={blog.id}
          blog={blog}
          onUpdate={(updateBlog) => handleUpdate(updateBlog, index)}
          onDelete={(id) => handleDelete(id, index)}
        />
      ))}
    </div>
  );
};

Main.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Main;
