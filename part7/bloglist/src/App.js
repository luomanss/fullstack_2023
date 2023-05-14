import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Navbar />
      <Notification />
      <Outlet />
    </>
  );
};

export default App;
