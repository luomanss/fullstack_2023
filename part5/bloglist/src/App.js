import { useState, useEffect, useContext, useRef } from "react";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";
import loginService from "./services/auth";
import blogService from "./services/blogs";
import AppContext from "./AppContext";

const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  const { type, content } = message;

  return <div className={`notification ${type}`}>{content}</div>;
};

const BlogForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({ title, author, url });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

const Blogs = ({ onLogout }) => {
  const [blogs, setBlogs] = useState([]);
  const { user, message, dispatchMessage } = useContext(AppContext);

  useEffect(() => {
    console.log("rerender triggered");

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
      dispatchMessage({ type: "error", content: response.error });
      return;
    }

    const newBlog = response.blog;

    blogFormRef.current.toggleVisibility();
    setBlogs(blogs.concat(newBlog));
    dispatchMessage({
      type: "success",
      content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
    });
  };

  const handleUpdate = async (updatedBlog, index) => {
    const result = await blogService.update(updatedBlog);

    if (result.error) {
      dispatchMessage({ type: "error", content: result.error });
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
      dispatchMessage({ type: "error", content: result.error });
      return;
    }

    const newBlogs = [...blogs];

    newBlogs.splice(index, 1);
    setBlogs(newBlogs);
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
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

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { message, dispatchMessage } = useContext(AppContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    const response = await loginService.login({ username, password });

    if (response.error) {
      dispatchMessage({ type: "error", content: response.error });
      return;
    }

    onLogin(response.user);
  };

  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const result = loginService.autoLogin();

    if (result) {
      setUser(result.user);
    }
  }, []);

  const dispatchMessage = async (message) => {
    setMessage(message);

    await sleep(5000);

    setMessage(null);
  };

  return (
    <AppContext.Provider value={{ user, message, dispatchMessage }}>
      {user ? (
        <Blogs onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={(user) => setUser(user)} />
      )}
    </AppContext.Provider>
  );
};

export default App;
