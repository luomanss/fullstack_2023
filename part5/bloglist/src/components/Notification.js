import PropTypes from "prop-types";

const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  const { type, content } = message;

  return <div className={`notification ${type}`}>{content}</div>;
};

Notification.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }),
};

export default Notification;
