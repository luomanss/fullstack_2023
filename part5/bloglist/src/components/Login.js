import { useState, useContext } from "react";
import PropTypes from "prop-types";
import AppContext from "../AppContext";
import loginService from "../services/auth";
import Notification from "./Notification";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { message, dispatchMessage } = useContext(AppContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    const response = await loginService.login({ username, password });

    if (response.error) {
      dispatchMessage({ type: "error", content: response.error });
      return;
    }

    onLogin(response.user);
  };

  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
