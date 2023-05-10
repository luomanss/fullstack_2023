// import { useEffect } from "react";
// import { useDispatch, /* useSelector */ } from "react-redux";
// import Main from "./components/Main";
// import Login from "./components/Login";
// import loginService from "./services/auth";
// import AppContext from "./AppContext";
// import { autoLogin } from "./reducers/authReducer";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";

// import { authActions } from "./store";
import { Outlet } from "react-router-dom";

const App = () => {
  // const [user, setUser] = useState(null);
  // const user = useSelector((state) => state.user);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // const result = loginService.autoLogin();

  //   // if (result) {
  //   //   setUser(result.user);
  //   // }
  //   dispatch(authActions.autoLogin());
  // }, []);

  return (
    <>
      <Navbar />
      <Notification />
      <Outlet />
    </>
  );

  // return user ? (
  //   <Main />
  // ) : (
  //   <Login />
  // );
};

export default App;
