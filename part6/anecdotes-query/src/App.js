import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const queryClient = useQueryClient();

  const voteMutation = useMutation(
    async (anecdote) => {
      axios.put(`/anecdotes/${anecdote.id}`, anecdote);

      return anecdote;
    },
    {
      onSuccess: (anecdote) => {
        const previousAnecdotes = queryClient.getQueryData("anecdotes");

        queryClient.setQueryData(
          "anecdotes",
          previousAnecdotes.map((previousAnecdote) =>
            previousAnecdote.id === anecdote.id ? anecdote : previousAnecdote
          )
        );
      },
    }
  );

  const handleVote = (anecdote) => {
    voteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    });
  };

  const result = useQuery("anecdotes", async () => {
    const result = await axios.get("/anecdotes");

    return result.data;
  });

  if (result.isLoading) {
    return <div>Loading...</div>;
  } else if (result.isError) {
    return <div>anecodote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
