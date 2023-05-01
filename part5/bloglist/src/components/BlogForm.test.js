import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

const testForm = {
  title: "A Test Blog",
  author: "Test Author",
  url: "https://example.com",
};

test("the form calls the event handler with input data", () => {
  const mockHandler = jest.fn();
  const result = render(<BlogForm onSubmit={mockHandler} />);
  const titleInput = result.container.querySelector("#title");
  const authorInput = result.container.querySelector("#author");
  const urlInput = result.container.querySelector("#url");
  const button = result.container.querySelector("button");

  act(() => {
    userEvent.type(titleInput, "A Test Blog");
    userEvent.type(authorInput, "Test Author");
    userEvent.type(urlInput, "https://example.com");
    button.click();
  });

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0]).toEqual(testForm);
});
