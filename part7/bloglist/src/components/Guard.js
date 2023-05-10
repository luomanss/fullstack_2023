import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Guard = ({ children }) => {
  const user = useSelector((state) => state.user);
  // const navigate = useNavigate();

  if (!user) {
    // navigate("/login");
    return <Navigate to="/login" />;
  }

  return children;
};

export default Guard;
