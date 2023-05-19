import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { blogsActions } from "../store";

import BlogFormModal from "../components/BlogFormModal";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  // CardBody,
  CardHeader,
  SimpleGrid,
  Heading,
  Text,
} from "@chakra-ui/react";

const BlogEntry = ({ blog }) => {
  return (
    <Link to={`/blogs/${blog.id}`}>
      <Card>
        <CardHeader>
          <Box>
            <Heading size={"sm"}>{blog.author}</Heading>
            <Text>{blog.title}</Text>
          </Box>
        </CardHeader>
      </Card>
    </Link>
  );
};

const Blogs = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => {
    const blogs = state.blogs.toSorted((a, b) => b.likes - a.likes);

    return { blogs, user: state.user };
  });

  useEffect(() => {
    dispatch(blogsActions.getAll());
  }, []);

  return (
    <>
      <BlogFormModal />
      <SimpleGrid columns={["1", "2", "3"]} spacing={10}>
        {blogs.map((blog) => (
          <BlogEntry key={blog.id} blog={blog} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Blogs;
