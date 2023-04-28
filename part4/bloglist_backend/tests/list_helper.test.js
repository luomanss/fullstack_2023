import { dummy, totalLikes, mostBlogs, mostLikes } from "../utils/list_helper";

test("dummy returns one", () => {
  const blogs = [];
  const result = dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("when list has only one blog, total likes equals the likes of that", () => {
    const listWithOneBlog = [
      {
        likes: 5,
      },
    ];

    const result = totalLikes(listWithOneBlog);

    expect(result).toBe(5);
  });
});

describe("most blogs", () => {
  test("when list has only one blog, author should be that and blogs should be one", () => {
    const listWithOneBlog = [
      {
        author: "Author 1",
      },
    ];

    const result = mostBlogs(listWithOneBlog);

    expect(result).toEqual({
      author: "Author 1",
      blogs: 1,
    });
  });

  test("when list has multiple blogs, author should be that with most blogs and blogs should be the count", () => {
    const listWithMultipleBlogs = [
      {
        author: "Author 1",
      },
      {
        author: "Author 2",
      },
      {
        author: "Author 1",
      },
    ];

    const result = mostBlogs(listWithMultipleBlogs);

    expect(result).toEqual({
      author: "Author 1",
      blogs: 2,
    });
  });

  test("when list is empty, it should return null", () => {
    const listWithNoBlogs = [];

    const result = mostBlogs(listWithNoBlogs);

    expect(result).toEqual(null);
  });
});

describe("most likes", () => {
  test("when list has only one blog, author should be that and likes should be the likes of that", () => {
    const listWithOneBlog = [
      {
        author: "Author 1",
        likes: 5,
      },
    ];

    const result = mostLikes(listWithOneBlog);

    expect(result).toEqual({
      author: "Author 1",
      likes: 5,
    });
  });

  test("when list has multiple blogs, author should be that with most likes and likes should be the sum of likes", () => {
    const listWithMultipleBlogs = [
      {
        author: "Author 1",
        likes: 5,
      },
      {
        author: "Author 2",
        likes: 10,
      },
      {
        author: "Author 1",
        likes: 6,
      },
    ];

    const result = mostLikes(listWithMultipleBlogs);

    expect(result).toEqual({
      author: "Author 1",
      likes: 11,
    });
  });
});
