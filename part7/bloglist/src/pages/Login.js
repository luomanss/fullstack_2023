import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  // Checkbox,
  // Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
// import AppContext from "../AppContext";
// import loginService from "../services/auth";
// import Notification from "../components/Notification";
// import { setNotificationWithTimeoutSeconds } from "../reducers/notificationReducer";
// import { login } from "../reducers/authReducer";
import { authActions } from "../store";

const onChangeHandler = (setter) => {
  return ({ target }) => {
    setter(target.value);
  };
};

// eslint-disable-next-line no-unused-vars
const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        w={"md"}
        maxW={"lg"}
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Username</FormLabel>
            <Input type="text" onChange={onChangeHandler(setUsername)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" onChange={onChangeHandler(setPassword)} />
          </FormControl>
          <Button
            type="submit"
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
          >
            Login
          </Button>
        </Stack>
      </Box>
    </form>
  );
};

const Login = () => {
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

  const handleLogin = ({ username, password }) => {
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
    <Center w={"100%"} p="10">
      {/* <h2>log in to application</h2> */}
      <LoginForm onSubmit={handleLogin} />
      {/* <form onSubmit={handleLogin}>
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
      </form> */}
    </Center>
  );
};

export default Login;
