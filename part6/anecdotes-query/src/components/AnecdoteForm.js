import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import NotificationContext from "../context/NotificationContext";

const AnecdoteForm = () => {
  const { setNotificationWithTimeout } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    async (anecdote) => {
      const result = await axios.post("/anecdotes", anecdote);

      return result.data;
    },
    {
      onSuccess: (newAnecdote) => {
        const previousAnecdotes = queryClient.getQueryData("anecdotes");

        queryClient.setQueryData(
          "anecdotes",
          previousAnecdotes.concat(newAnecdote)
        );

        setNotificationWithTimeout(
          `a new anecdote '${newAnecdote.content}' created!`,
          5000
        );
      },
      onError: ({
        response: {
          data: { error },
        },
      }) => {
        if (error) {
          setNotificationWithTimeout(error, 5000);
        }
      },
    }
  );

  const onCreate = (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";

    createMutation.mutate({
      content,
      votes: 0,
    });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
