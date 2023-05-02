import { useState } from "react";
import PropTypes from "prop-types";

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
    <form id="form" onSubmit={handleSubmit}>
      <div>
        title:
        <input
          id="title"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
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
        />
      </div>
      <button id="create-button" type="submit">create</button>
    </form>
  );
};

BlogForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default BlogForm;
