import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
  const response = await axios.get(baseUrl);

  return response.data;
};

const create = async (blog) => {
  const response = await axios.post(baseUrl, blog);

  if (response.status === 201) {
    return {
      blog: response.data,
    };
  }

  return {
    error: "Could not create new blog",
  };
};

const service = { getAll, create };

export default service;
