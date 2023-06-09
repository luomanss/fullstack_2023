import { useState, useContext } from "react";
import AppContext from "../AppContext";

const Blog = ({ blog, onUpdate, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const { user } = useContext(AppContext);

  const handleLikes = (e) => {
    e.preventDefault();

    const updatedBlog = {
      id: blog.id,
      likes: blog.likes + 1,
    };

    onUpdate(updatedBlog);
  };

  const handleDelete = (e) => {
    e.preventDefault();

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      onDelete(blog.id);
    }
  };

  return (
    <div className="entry" data-cy="blog">
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)} data-cy="view-button">view</button>
      {visible ? (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLikes} data-cy="like-button">like</button>
          </div>
          <div>{blog.user.name}</div>
          {user && user.id === blog.user.id ? (
            <button onClick={handleDelete} data-cy="delete-button">delete</button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Blog;
