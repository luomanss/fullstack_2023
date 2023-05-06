import { useDispatch } from "react-redux";
import { createNew } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const createAnecdote = (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value.trim();
    event.target.anecdote.value = "";

    if (content.length === 0) {
      return;
    }

    dispatch(createNew(content));
    dispatch(setNotification(`you created '${content}'`));
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;