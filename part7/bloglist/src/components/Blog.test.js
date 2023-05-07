import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Blog from "./Blog";

const blog = {
  title: "A Test Blog",
  author: "Test Author",
  url: "https://example.com",
  likes: 0,
  user: {
    name: "Test User",
  },
};

test("renders content without url, likes or user name", () => {
  render(<Blog blog={blog} />);

  screen.getByText(`${blog.title} ${blog.author}`);

  let element = screen.queryByText(blog.url);
  expect(element).toBeNull();

  element = screen.queryByText(`likes ${blog.likes}`);
  expect(element).toBeNull();

  element = screen.queryByText(blog.user.name);
  expect(element).toBeNull();
});

test("clicking the button shows the url and likes", () => {
  render(<Blog blog={blog} />);

  const button = screen.getByText("view");

  expect(button).toBeDefined();

  act(() => {
    button.click();
  });

  screen.getByText("A Test Blog Test Author");
  screen.getByText(blog.url);
  screen.getByText(`likes ${blog.likes}`);
  screen.getByText(blog.user.name);
});

test("clicking the like button twice calls the event handler twice", () => {
  const mockHandler = jest.fn();

  render(<Blog blog={blog} onUpdate={mockHandler} />);

  let button = screen.getByText("view");

  act(() => {
    button.click();
  });

  button = screen.getByText("like");

  act(() => {
    button.click();
  });

  expect(mockHandler.mock.calls).toHaveLength(1);

  act(() => {
    button.click();
  });

  expect(mockHandler.mock.calls).toHaveLength(2);
});
