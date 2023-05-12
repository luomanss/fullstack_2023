import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Guard from "./components/Guard";
import Login from "./pages/Login";
import Blogs from "./pages/Blogs";
import Users from "./pages/Users";
import User from "./pages/User";
import Blog from "./pages/Blog";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/404",
        element: <div>404, Not found :(</div>,
      },
      {
        path: "/",
        element: (
          <Guard>
            <Blogs />,
          </Guard>
        ),
      },
      {
        path: "/blogs/:id",
        element: (
          <Guard>
            <Blog />
          </Guard>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/users",
        element: (
          <Guard>
            <Users />
          </Guard>
        ),
      },
      {
        path: "/users/:id",
        element: (
          <Guard>
            <User />
          </Guard>
        ),
      },
    ],
  },
]);

export default router;
