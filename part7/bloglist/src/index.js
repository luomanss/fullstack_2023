import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./index.css";

import store from "./store";
import router from "./router";

const theme = extendTheme({
  textStyles: {
    subtitle: {
      fontSize: "sm",
      fontWeight: "semibold",
      lineHeight: "shorter",
      marginTop: "0",
      color: "gray.500",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </Provider>
);
