import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
  const response = await axios.get(baseUrl);

  return response.data;
};

const create = async (blog) => {
  let response;

  try {
    response = await axios.post(baseUrl, blog);
  } catch (error) {
    if (error.response.status === 401) {
      return {
        error: "Unauthorized",
      };
    } else {
      return {
        error: "Something went wrong",
      };
    }
  }

  return {
    blog: response.data,
  };
};

const patchLikes = async (blog) => {
  let response;

  try {
    response = await axios.patch(`${baseUrl}/${blog.id}`, { likes: blog.likes });
  } catch (error) {
    if (error.response.status === 401) {
      return {
        error: "Unauthorized",
      };
    } else {
      return {
        error: "Something went wrong",
      };
    }
  }

  return {
    blog: response.data,
  };
};

const remove = async (id) => {
  try {
    await axios.delete(`${baseUrl}/${id}`);
  } catch (error) {
    if (error.response.status === 401) {
      return {
        error: "Unauthorized",
      };
    } else {
      return {
        error: "Something went wrong",
      };
    }
  }

  return {
    success: true,
  };
};

const service = { getAll, create, patchLikes, remove };

export default service;
