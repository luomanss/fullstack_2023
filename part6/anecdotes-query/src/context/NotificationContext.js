import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null);

  const setNotification = (message) => {
    dispatch({
      type: "SET_NOTIFICATION",
      payload: message,
    });
  };

  const clearNotification = () => {
    dispatch({
      type: "CLEAR_NOTIFICATION",
    });
  };

  const setNotificationWithTimeout = async (message, timeout) => {
    setNotification(message);
    await sleep(timeout);
    clearNotification();
  };

  return (
    <NotificationContext.Provider
      value={{ notification, setNotificationWithTimeout }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
