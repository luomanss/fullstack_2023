import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { blogsActions } from "../store";

const AddComment = ({ blog }) => {
  const dispatch = useDispatch();

  const handleAddComment = (e) => {
    e.preventDefault();

    const comment = e.target.comment.value;

    dispatch(blogsActions.addComment(blog.id, comment));
  };

  return (
    <form onSubmit={handleAddComment}>
      <input type="text" name="comment" />
      <button type="submit">add comment</button>
    </form>
  );
};

const Blog = () => {
  const id = useParams().id;
  const dispatch = useDispatch();
  const blog = useSelector((state) => {
    const blog = state.blogs.find((blog) => blog.id === id);

    return blog ? blog : null;
  });

  if (blog === null) {
    throw {
      error: "Blog not found",
    };
  }

  const user = useSelector((state) => state.user);

  if (!user) {
    throw {
      error: "Unauthorized",
    };
  }

  const handleLikes = (e) => {
    e.preventDefault();

    const updatedLikes = {
      id: blog.id,
      likes: blog.likes + 1,
    };

    dispatch(blogsActions.updateLikes(updatedLikes));
  };

  const handleDelete = (e) => {
    e.preventDefault();

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(blogsActions.remove(blog.id));
    }
  };

  return (
    <div data-cy="blog">
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={handleLikes} data-cy="like-button">
            like
          </button>
        </div>
        <div>added by {blog.user.name}</div>
        {user && user.id === blog.user.id ? (
          <button onClick={handleDelete} data-cy="delete-button">
            delete
          </button>
        ) : null}
      </div>
      <h3>comments</h3>
      <AddComment blog={blog} />
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
