import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);

    return response.data;
  } catch (error) {
    console.log(error);
  }

  return [];
};

const create = async (newPerson) => {
  try {
    const response = await axios.post(baseUrl, newPerson);

    return response.data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

const update = async (id, { name, number }) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, { name, number });

    return response.data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

const remove = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);

    return response.status === 200 ? true : false;
  } catch (error) {
    console.log(error);
  }

  return false;
};

const service = { getAll, create, update, remove };

export default service;
