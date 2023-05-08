import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Main from "./components/Main";
import Login from "./components/Login";
// import loginService from "./services/auth";
// import AppContext from "./AppContext";
import { autoLogin } from "./reducers/userReducer";

const App = () => {
  // const [user, setUser] = useState(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // const result = loginService.autoLogin();

    // if (result) {
    //   setUser(result.user);
    // }
    dispatch(autoLogin());
  }, []);

  return user ? (
    <Main />
  ) : (
    <Login />
  );
};

export default App;
