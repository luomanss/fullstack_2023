import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { blogsActions } from "../store";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  IconButton,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { DeleteIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { FaComment, FaHeart } from "react-icons/fa";

const AddComment = ({ blog }) => {
  const dispatch = useDispatch();

  const handleAddComment = (e) => {
    e.preventDefault();

    const comment = e.target.comment.value;

    dispatch(blogsActions.addComment(blog.id, comment));
  };

  return (
    <form onSubmit={handleAddComment}>
      <FormControl>
        <Stack direction="row">
          <Input type="text" name="comment" />
          <IconButton
            bg="teal"
            color="white"
            type="submit"
            icon={<FaComment />}
          />
        </Stack>
      </FormControl>
    </form>
  );
};

const Blog = () => {
  const id = useParams().id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blog = useSelector((state) => {
    const blog = state.blogs.find((blog) => blog.id === id);

    return blog ? blog : null;
  });

  if (blog === null) {
    throw {
      error: "Blog not found",
    };
  }

  const user = useSelector((state) => state.user);

  if (!user) {
    throw {
      error: "Unauthorized",
    };
  }

  const handleLikes = (e) => {
    e.preventDefault();

    const updatedLikes = {
      id: blog.id,
      likes: blog.likes + 1,
    };

    dispatch(blogsActions.updateLikes(updatedLikes));
  };

  const handleDelete = (e) => {
    e.preventDefault();

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(blogsActions.remove(blog.id));
      navigate("/");
    }
  };

  return (
    <Flex direction={["column", null, "row"]} gap="6">
      <Stack w="md" gap="4">
        <Box>
          <Heading size="md">{blog.title}</Heading>
          <Text>by {blog.author}</Text>
        </Box>
        <Stack>
          <Link href={blog.url} isExternal>
            {blog.url}
            <ExternalLinkIcon mx="2px" />
          </Link>
          <Stack direction="row" spacing="2" align="center">
            <Text>likes {blog.likes}</Text>
            <IconButton
              size="xs"
              icon={<FaHeart />}
              onClick={handleLikes}
              data-cy="like-button"
            />
            {user && user.id === blog.user.id ? (
              <IconButton
                colorScheme="red"
                size="xs"
                icon={<DeleteIcon />}
                onClick={handleDelete}
                data-cy="delete-button"
              />
            ) : null}
          </Stack>
        </Stack>
        <Divider />
        <Text fontSize="sm" fontStyle="italic">
          Added by {blog.user.name}
        </Text>
      </Stack>
      <Stack w="300px" gap="2">
        <Heading size="md">Comments</Heading>
        <AddComment blog={blog} />
        <UnorderedList h="150px" overflowY="scroll" stylePosition="inside">
          {blog.comments.map((comment, index) => (
            <ListItem key={index}>{comment}</ListItem>
          ))}
        </UnorderedList>
      </Stack>
    </Flex>
  );
};

export default Blog;
