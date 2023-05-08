import { useState } from "react";
import { useDispatch } from "react-redux";
// import AppContext from "../AppContext";
// import loginService from "../services/auth";
import Notification from "./Notification";
// import { setNotificationWithTimeoutSeconds } from "../reducers/notificationReducer";
import { login } from "../reducers/userReducer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const { message, dispatchMessage } = useContext(AppContext);
  const dispatch = useDispatch();

  const handleLogin = (event) => {
    event.preventDefault();

    dispatch(login({ username, password }));

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
