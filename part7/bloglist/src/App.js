import { useState, useEffect } from "react";
import Main from "./components/Main";
import Login from "./components/Login";
import loginService from "./services/auth";
import AppContext from "./AppContext";

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [user, setUser] = useState(null);
  // const [message, setMessage] = useState(null);

  useEffect(() => {
    const result = loginService.autoLogin();

    if (result) {
      setUser(result.user);
    }
  }, []);

  // const dispatchMessage = async (message) => {
  //   setMessage(message);

  //   await sleep(5000);

  //   setMessage(null);
  // };

  return (
    <AppContext.Provider value={{ user, /* message, dispatchMessage */ }}>
      {user ? (
        <Main onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={(user) => setUser(user)} />
      )}
    </AppContext.Provider>
  );
};

export default App;
