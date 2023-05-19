import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react";

const User = () => {
  const id = useParams().id;
  const user = useSelector((state) => {
    const user = state.users.find((user) => user.id === id);

    return user ? user : null;
  });

  if (!user) {
    // TODO: throw error
    return <Navigate to="/404" />;
  }

  return (
    <Stack>
      <Heading size="md">{user.name}</Heading>
      <Heading size="sm">added blogs</Heading>
      <UnorderedList stylePosition="inside">
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} >{blog.title}</ListItem>
        ))}
      </UnorderedList>
    </Stack>
  );
};

export default User;
