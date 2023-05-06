import { useDispatch, useSelector } from "react-redux";
import { initializeAnecdotes, vote } from "../reducers/anecdoteReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";
import { useEffect } from "react";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => {
    return state.anecdotes
      .filter((a) => a.content.includes(state.filter))
      .toSorted((a, b) => b.votes - a.votes);
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  const handleClick = (anecdote) => {
    dispatch(vote(anecdote.id));
    dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 5));
  };

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleClick(anecdote)}>vote</button>
      </div>
    </div>
  ));
};

export default AnecdoteList;
