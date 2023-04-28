import axios from "axios";

const baseUrl = "/persons";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);

    return { persons: response.data};
  } catch (error) {
    console.log(error);

    return error.response.data;
  }
};

const create = async (newPerson) => {
  try {
    const response = await axios.post(baseUrl, newPerson);

    return { person: response.data };
  } catch (error) {
    console.log(error);

    return error.response.data;
  }
};

const update = async (id, { name, number }) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, { name, number });

    return { person: response.data };
  } catch (error) {
    console.log(error);

    return error.response.data;
  }
};

const remove = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);

    return response.status === 200 || response.status === 204
      ? { success: true }
      : { success: false };
  } catch (error) {
    console.log(error);

    return error.response.data;
  }
};

const service = { getAll, create, update, remove };

export default service;
