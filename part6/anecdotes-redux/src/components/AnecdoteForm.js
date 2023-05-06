import { useDispatch } from "react-redux";
import { createNew } from "../reducers/anecdoteReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const createAnecdote = async (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value.trim();
    event.target.anecdote.value = "";

    if (content.length === 0) {
      return;
    }

    dispatch(createNew(content));
    dispatch(setNotificationWithTimeout(`you created '${content}'`, 5));
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
