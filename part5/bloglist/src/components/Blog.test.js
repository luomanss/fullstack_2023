import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "A Test Blog",
    author: "Test Author",
    url: "https://example.com",
    likes: 0,
  };

  render(<Blog blog={blog}/>);

  const element = screen.getByText(
    "A Test Blog Test Author");
  expect(element).toBeDefined();
  expect(element).toHaveTextContent(`${blog.title} ${blog.author}`);
  expect(element).not.toHaveTextContent(blog.url);
});
