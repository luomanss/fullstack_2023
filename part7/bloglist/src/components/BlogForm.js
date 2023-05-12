import { useDispatch } from "react-redux";
import { useState } from "react";
import { create } from "../reducers/blogsReducer";
// import { Togglable } from "./Togglable";

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(create({ title, author, url }));
    setTitle("");
    setAuthor("");
    setUrl("");
    onCreate();
  };

  return (
    <form id="form" onSubmit={handleSubmit}>
      <div>
        title:
        <input
          id="title"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          data-cy="title-field"
        />
      </div>
      <div>
        author:
        <input
          id="author"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          data-cy="author-field"
        />
      </div>
      <div>
        url:
        <input
          id="url"
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          data-cy="url-field"
        />
      </div>
      <button id="create-button" type="submit" data-cy="create-blog-button">
        create
      </button>
    </form>
  );
};

const ToggleableBlogForm = () => {
  const [visible, setVisible] = useState(false);

  return visible ? (
    <>
      <BlogForm onCreate={() => setVisible(false)} />
      <button onClick={() => setVisible(false)}>cancel</button>
    </>
  ) : (
    <button onClick={() => setVisible(true)}>new blog</button>
  );
};

export default ToggleableBlogForm;
