import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const App = () => {
  return (
    <>
      <Navbar />
      <Notification />
      <Box maxW={"100%"} p="6">
        <Outlet />
      </Box>
    </>
  );
};

export default App;
