import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { blogsActions } from "../store";

import Blog from "../components/Blog";

const Bloglist = () => {
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
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default Bloglist;
