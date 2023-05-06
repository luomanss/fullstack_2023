import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    {
      return state.anecdotes
        .filter((a) => a.content.includes(state.filter))
        .toSorted((a, b) => b.votes - a.votes);
    }
  );

  const dispatch = useDispatch();

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
      </div>
    </div>
  ));
};

export default AnecdoteList;