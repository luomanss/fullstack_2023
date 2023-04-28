const info = (...params) => {
  console.log(...params);
};

const error = (...params) => {
  console.error(...params);
};

const logger = {
  info: process.env.NODE_ENV !== "test" ? info : () => {},
  error: process.env.NODE_ENV !== "test" ? error : () => {},
};

export default logger;
