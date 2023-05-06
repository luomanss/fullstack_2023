import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdoteService";

// const anecdotesAtStart = [
//   "If it hurts, do it more often",
//   "Adding manpower to a late software project makes it later!",
//   "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
//   "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
//   "Premature optimization is the root of all evil.",
//   "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
// ];

// const getId = () => (100000 * Math.random()).toFixed(0);

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0,
//   };
// };

// const initialState = anecdotesAtStart.map(asObject);

const slice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    // createNew: (state, action) => {
    //   const content = action.payload;

    //   state.push({
    //     content,
    //     id: getId(),
    //     votes: 0,
    //   });
    // },
    updateVote: (state, action) => {
      const id = action.payload;
      const anecdoteToChange = state.find((n) => n.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };

      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote
      );
    },
    setAnecdotes: (state, action) => {
      return action.payload;
    },
    appendAnecdote: (state, action) => {
      state.push(action.payload);
    },
  },
});

const { updateVote, setAnecdotes, appendAnecdote } = slice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createNew = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(anecdote));
  };
};

export const vote = (id) => {
  return async (dispatch) => {
    await anecdoteService.updateVote(id);
    dispatch(updateVote(id));
  };
};

export default slice.reducer;
