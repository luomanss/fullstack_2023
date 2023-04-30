import { useState, useEffect, useContext, createContext } from "react";
import Blog from "./components/Blog";
import loginService from "./services/auth";
import blogService from "./services/blogs";

const AppContext = createContext({
  user: null,
  message: null,
  dispatchMessage: () => {},
});

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
    (async () => {
      const blogs = await blogService.getAll();

      setBlogs(blogs);
    })();
  });

  const handleLogout = () => {
    loginService.logout();

    onLogout();
  };

  const handleNewBlog = async (blog) => {
    const response = await blogService.create(blog);

    if (response.error) {
      dispatchMessage({ type: "error", content: response.error });
      return;
    }

    const newBlog = response.blog;

    setBlogs(blogs.concat(newBlog));
    dispatchMessage({
      type: "success",
      content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
    });
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>
      <BlogForm onSubmit={handleNewBlog} />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
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
