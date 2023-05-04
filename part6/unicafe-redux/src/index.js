import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

const App = () => {
  const buttonProps = ["good", "ok", "bad"].map((type) => {
    const action = () => {
      store.dispatch({
        type: type.toUpperCase(),
      });
    };

    return {
      type,
      action,
    };
  });

  const resetStats = () => {
    store.dispatch({
      type: "ZERO",
    });
  };

  return (
    <div>
      {buttonProps.map(({ type, action }) => (
        <button key={type} onClick={action}>
          {type}
        </button>
      ))}
      <button onClick={resetStats}>reset stats</button>
      {buttonProps.map(({ type }) => (
        <div key={type}>
          {type} {store.getState()[type]}
        </div>
      ))}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
  root.render(<App />);
};

renderApp();
store.subscribe(renderApp);
