import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const AnecdoteForm = () => {
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
