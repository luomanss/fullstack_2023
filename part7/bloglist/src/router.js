import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Guard from "./components/Guard";
import Login from "./pages/Login";
import Bloglist from "./pages/Bloglist";
import Users from "./pages/Users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Guard>
            <Bloglist />,
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
    ],
  },
]);

export default router;
