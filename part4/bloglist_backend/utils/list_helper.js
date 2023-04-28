export const dummy = (_blogs) => 1;

export const totalLikes = (blogs) => {
  return blogs.reduce((sum, { likes }) => sum + likes, 0);
};

export const mostBlogs = (blogs) => {
  if (blogs === undefined || blogs.length === 0) {
    return null;
  }

  const authorBlogCountMap = blogs.reduce((countMap, { author }) => {
    countMap[author] = countMap[author] ? countMap[author] + 1 : 1;

    return countMap;
  }, {});

  const author = Object.keys(authorBlogCountMap).reduce((a, b) =>
    authorBlogCountMap[a] > authorBlogCountMap[b] ? a : b
  );

  return {
    author,
    blogs: authorBlogCountMap[author],
  };
};

export const mostLikes = (blogs) => {
  if (blogs === undefined || blogs.length === 0) {
    return null;
  }

  const authorLikesMap = blogs.reduce((likesMap, { author, likes }) => {
    likesMap[author] = likesMap[author] ? likesMap[author] + likes : likes;

    return likesMap;
  }, {});

  const author = Object.keys(authorLikesMap).reduce((a, b) =>
    authorLikesMap[a] > authorLikesMap[b] ? a : b
  );

  return {
    author,
    likes: authorLikesMap[author],
  };
};
