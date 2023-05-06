import axios from "axios";

const baseUrl = "/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const get = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);

  return response.data;
};

const createNew = async (content) => {
  const anecdote = { content, votes: 0 };
  const response = await axios.post(baseUrl, anecdote);

  return response.data;
};

const updateVote = async (id) => {
  const anecdote = await get(id);
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
  const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote);

  return response.data;
};

const service = { getAll, get, createNew, updateVote };

export default service;