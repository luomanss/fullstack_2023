import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  useDisclosure,
  Button,
  FormControl,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  Stack,
  FormLabel,
  Input,
  ModalHeader,
} from "@chakra-ui/react";
import { create } from "../reducers/blogsReducer";
// import { Togglable } from "./Togglable";

const BlogForm = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(create({ title, author, url }));
    setTitle("");
    setAuthor("");
    setUrl("");
    onCreate();
  };

  return (
    <form id="form" onSubmit={handleSubmit}>
      <Stack spacing={4} mb="2">
        <FormControl id="title">
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            onChange={({ target }) => setTitle(target.value)}
            data-cy="title-field"
          />
        </FormControl>
        <FormControl id="author">
          <FormLabel>Author</FormLabel>
          <Input
            type="text"
            onChange={({ target }) => setAuthor(target.value)}
            data-cy="author-field"
          />
        </FormControl>
        <FormControl id="url">
          <FormLabel>Url</FormLabel>
          <Input
            type="text"
            onChange={({ target }) => setUrl(target.value)}
            data-cy="url-field"
          />
        </FormControl>
        <Stack spacing="4" mb="2" direction={"row"}>
          <Button
            mb="2"
            colorScheme="green"
            id="create-button"
            type="submit"
            data-cy="create-blog-button"
          >
            Create
          </Button>
          <Button
            mb="2"
            colorScheme="red"
            id="cancel-button"
            type="button"
            data-cy="cancel-create-blog-button"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

const BlogFormModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} mb="4" data-cy="new-blog-modal-button">New blog</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new blog</ModalHeader>
          <ModalBody>
            <BlogForm onCreate={onClose} onCancel={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BlogFormModal;
