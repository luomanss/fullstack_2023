import { useDispatch } from "react-redux";
import { useState } from "react";
import { create } from "../reducers/blogsReducer";

const BlogForm = () => {
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
      <button id="create-button" type="submit" data-cy="create-blog-button">create</button>
    </form>
  );
};

export default BlogForm;
