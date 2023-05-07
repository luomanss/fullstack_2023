import { createContext } from "react";

export default createContext({
  user: null,
  message: null,
  dispatchMessage: () => {},
});
