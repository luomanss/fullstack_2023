import { useState, useEffect } from "react";
import Main from "./components/Main";
import Login from "./components/Login";
import loginService from "./services/auth";
import AppContext from "./AppContext";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const result = loginService.autoLogin();

    if (result) {
      setUser(result.user);
    }
  }, []);

  return (
    <AppContext.Provider value={{ user }}>
      {user ? (
        <Main onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={(user) => setUser(user)} />
      )}
    </AppContext.Provider>
  );
};

export default App;
