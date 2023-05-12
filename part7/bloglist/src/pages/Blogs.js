import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { blogsActions } from "../store";

import ToggleableBlogForm from "../components/BlogForm";
import { Link } from "react-router-dom";

const BlogEntry = ({ blog }) => {
  return (
    <div className="entry">
      <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
    </div>
  );
};


const Blogs = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => {
    const blogs = state.blogs.toSorted((a, b) => b.likes - a.likes);

    return { blogs, user: state.user };
  });

  useEffect(() => {
    dispatch(blogsActions.getAll());
  }, []);

  return (
    <div>
      <h2>Blogs</h2>
      <ToggleableBlogForm />
      {blogs.map((blog) => (
        <BlogEntry key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default Blogs;
