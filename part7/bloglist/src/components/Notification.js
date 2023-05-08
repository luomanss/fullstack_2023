import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => {
    return state.notification;
  });

  if (!notification) {
    return null;
  }

  const { type, content } = notification;

  return <div className={`notification ${type}`}>{content}</div>;
};

export default Notification;
