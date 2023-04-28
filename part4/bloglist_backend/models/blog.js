import mongoose from "../utils/mongoose.js";

const blogSchema = mongoose.Schema(
  {
    title: String,
    author: String,
    url: String,
    likes: Number,
  },
  {
    toJSON: {
      transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    },
  }
);

const Blog = mongoose.model('Blog', blogSchema)

export default Blog;
