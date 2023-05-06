import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    {
      return state.anecdotes
        .filter((a) => a.content.includes(state.filter))
        .toSorted((a, b) => b.votes - a.votes);
    }
  );

  const dispatch = useDispatch();

  const handleClick = (anecdote) => {
    dispatch(vote(anecdote.id));
    dispatch(setNotification(`you voted '${anecdote.content}'`));
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
