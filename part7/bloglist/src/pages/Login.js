import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import AppContext from "../AppContext";
// import loginService from "../services/auth";
import Notification from "../components/Notification";
// import { setNotificationWithTimeoutSeconds } from "../reducers/notificationReducer";
// import { login } from "../reducers/authReducer";
import { authActions } from "../store";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  // const { message, dispatchMessage } = useContext(AppContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.autoLogin());
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleLogin = (event) => {
    event.preventDefault();

    dispatch(authActions.login({ username, password }));

    // const response = await loginService.login({ username, password });

    // if (response.error) {
    //   dispatch(
    //     setNotificationWithTimeoutSeconds(
    //       { type: "error", content: response.error },
    //       5
    //     )
    //   );
    //   // dispatchMessage({ type: "error", content: response.error });
    //   return;
    // }

    // onLogin(response.user);
  };

  return (
    <div>
      <h2>log in to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            data-cy="username-field"
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            data-cy="password-field"
          />
        </div>
        <button id="login-button" type="submit" data-cy="login-button">
          login
        </button>
      </form>
    </div>
  );
};

export default Login;
