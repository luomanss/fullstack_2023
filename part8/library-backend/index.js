import { ApolloServer } from "@apollo/server";
import { GraphQLError } from "graphql";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { PubSub } from "graphql-subscriptions";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import http from "http";
import Author from "./models/author.js";
import Book from "./models/book.js";
import User from "./models/user.js";

dotenv.config();

const SALT_ROUNDS = 10;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

console.log("connecting to", MONGODB_URI);

await mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let authors = [
  {
    name: "Robert Martin",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky",
  },
  {
    name: "Sandi Metz",
  },
];

await Author.deleteMany({});
await Book.deleteMany({});

const savedAuthors = await Author.insertMany(authors);

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "revolution"],
  },
].map((book) => {
  const author = savedAuthors.find((a) => a.name === book.author);

  return { ...book, author: author._id };
});

await Book.insertMany(books);

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      password: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [String!]!
    me: User
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const pubsub = new PubSub();
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_root, { author: name, genre }) => {
      if (name && genre) {
        const author = await Author.findOne({ name });

        return Book.find({ author, genres: { $in: [genre] } }).populate(
          "author"
        );
      }

      if (name) {
        const author = await Author.findOne({ name });

        return Book.find({ author }).populate("author");
      }

      if (genre) {
        return Book.find({ genres: { $in: [genre] } }).populate("author");
      }

      return Book.find({}).populate("author");
    },
    allAuthors: async () => {
      return Author.aggregate([
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "author",
            as: "books",
          },
        },
        {
          $project: {
            id: { $toString: "$_id" },
            name: 1,
            born: 1,
            bookCount: { $size: "$books" },
          },
        },
      ]);
    },
    allGenres: async () => {
      const books = await Book.find({});
      const genres = books.map((book) => book.genres).flat();

      return [...new Set(genres)];
    },
    me: async (_root, _args, context) => {
      return context.user;
    },
  },
  Author: {
    bookCount: async (root) => Book.find({ author: root.id }).countDocuments(),
  },
  Mutation: {
    addBook: async (
      _root,
      { title, author: name, published, genres },
      { user }
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      let author = await Author.findOne({ name });

      if (!author) {
        author = new Author({ name });
        author = await author.save();
      }

      const book = new Book({ title, author, published, genres });

      try {
        const saved_book = await book.save();

        pubsub.publish("BOOK_ADDED", { bookAdded: saved_book });
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError(error.message, {
            extensions: { code: "BAD_USER_INPUT", invalidArgs: error.errors },
          });
        } else {
          throw error;
        }
      }
    },
    editAuthor: async (_root, { name, setBornTo }, { user }) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const author = await Author.findOne({ name });

      if (!author) {
        return null;
      }

      author.born = setBornTo;

      return author.save();
    },
    createUser: async (_root, { username, password, favoriteGenre }) => {
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = new User({ username, passwordHash, favoriteGenre });

      try {
        return await user.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError(error.message, {
            extensions: { code: "BAD_USER_INPUT", invalidArgs: error.errors },
          });
        } else {
          throw error;
        }
      }
    },
    login: async (_root, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new GraphQLError("Invalid username or password", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

      if (!passwordCorrect) {
        throw new GraphQLError("Invalid username or password", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const token = jwt.sign(
        { username: user.username, id: user._id },
        JWT_SECRET
      );

      return { value: token };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(["BOOK_ADDED"]),
    },
  },
};

const app = express();
const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: "/" });
const schema = makeExecutableSchema({ typeDefs, resolvers });
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  "/",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;

      if (!auth) {
        return {};
      }

      let [bearer, token] = auth.split(" ");

      if (!bearer || bearer !== "Bearer" || !token) {
        return {};
      }

      let decodedToken = null;

      try {
        decodedToken = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        throw new GraphQLError("Invalid token", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const user = await User.findById(decodedToken.id);

      return { user };
    },
  })
);

const PORT = 4000;

await new Promise((resolve) => httpServer.listen(PORT, resolve));

console.log(`Server is now running on http://localhost:${PORT}`);
