import { createSlice } from "@reduxjs/toolkit";
import blogsService from "../services/blogs";
import { setNotificationWithTimeoutSeconds } from "./notificationReducer";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      return [...state, action.payload];
    },
    updateBlog(state, action) {
      const blog = action.payload;
      const id = blog.id;

      return state.map((b) => (b.id === id ? blog : b));
    },
    removeBlog(state, action) {
      const id = action.payload;

      return state.filter((b) => b.id !== id);
    },
    setComments(state, action) {
      const { id, comments } = action.payload;

      return state.map((b) => {
        if (b.id === id) {
          return { ...b, comments };
        }

        return b;
      });
    },
  },
});

const { setBlogs, addBlog, updateBlog, removeBlog, setComments } = blogsSlice.actions;

export const getAll = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll();

    dispatch(setBlogs(blogs));
  };
};

export const create = (blog) => {
  return async (dispatch) => {
    const response = await blogsService.create(blog);

    if (response.error) {
      dispatch(
        setNotificationWithTimeoutSeconds(
          { type: "error", content: response.error },
          5
        )
      );
      return;
    }

    const newBlog = response.blog;

    dispatch(addBlog(newBlog));

    dispatch(
      setNotificationWithTimeoutSeconds(
        {
          type: "success",
          content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        },
        5
      )
    );
  };
};

export const updateLikes = (blog) => {
  return async (dispatch) => {
    const result = await blogsService.patchLikes(blog);

    if (result.error) {
      dispatch(
        setNotificationWithTimeoutSeconds(
          { type: "error", content: result.error },
          5
        )
      );
      return;
    }

    dispatch(updateBlog(result.blog));
  };
};

export const remove = (id) => {
  return async (dispatch) => {
    const response = await blogsService.remove(id);

    if (response.error) {
      dispatch(
        setNotificationWithTimeoutSeconds(
          { type: "error", content: response.error },
          5
        )
      );
      return;
    }

    dispatch(removeBlog(id));
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    const response = await blogsService.addComment(id, comment);

    if (response.error) {
      dispatch(
        setNotificationWithTimeoutSeconds(
          { type: "error", content: response.error },
          5
        )
      );

      return;
    }

    dispatch(
      setNotificationWithTimeoutSeconds(
        { type: "success", content: "comment added" },
        5
      )
    );

    dispatch(
      setComments({
        id,
        comments: response.blog.comments,
      })
    );
  };
};

export default blogsSlice.reducer;
