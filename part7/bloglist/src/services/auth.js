import axios from "axios";

const baseUrl = "/api/login";

const autoLogin = () => {
  const user = localStorage.getItem("user");

  if (user) {
    const parsedUser = JSON.parse(user);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${parsedUser.token}`;

    return {
      user: {
        id: parsedUser.id,
        username: parsedUser.username,
        name: parsedUser.name,
      },
    };
  }

  return null;
};

const login = async ({ username, password }) => {
  let response;

  try {
    response = await axios.post(baseUrl, { username, password });
  } catch (error) {
    if (error.response.status === 401) {
      return {
        error: "Invalid username or password",
      };
    } else {
      return {
        error: "Something went wrong",
      };
    }
  }

  const user = {
    id: response.data.id,
    username: response.data.username,
    name: response.data.name,
  };

  localStorage.setItem("user", JSON.stringify(response.data));

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${response.data.token}`;

  return {
    user,
  };
};

const logout = () => {
  localStorage.removeItem("user");

  delete axios.defaults.headers.common["Authorization"];
};

const service = { autoLogin, login, logout };

export default service;
